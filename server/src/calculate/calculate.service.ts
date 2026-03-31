import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Baseline } from '../entities/baseline.entity';
import { CreateCalculateDto } from './dto/create-calculate.dto';
import { HistoryService } from 'src/history/history.service';

export interface ExpenseBreakdown {
  housing: number;            // rent share + bills + council
  food_and_drink: number;     // groceries + meals out + coffees
  transport: number;
  clothing: number;
  gym: number;
  personal_care: number;
  phone: number;
  subscriptions: number;
  health: number;
  other: number;
  amortized_one_off: number;
}

export interface SavingSuggestion {
  label: string;
  description: string;
  monthly_saving: number;
  percentage_of_gap: number; // how much of the baseline gap this covers
}

export interface CalculationResult {
  ukvi_baseline: number;
  city_minimum: number;
  midpoint_budget: number;
  midpoint_pct_of_ukvi: number;         // e.g. 44 (percent)
  below_ukvi: boolean;
  below_city_minimum: boolean;
  budget_gap_from_ukvi: number;  
  budget_range_label: string;

  // Monthly totals
  typical_month_total: number;
  first_month_total: number;

  // First-month components (shown separately in UI)
  first_month_rent_share: number;
  typical_rent_share: number;
  deposit: number;
  upfront_one_off: number;

  // Budget coverage
  midpoint_covers_pct_of_typical: number; // donut chart value

  // Expense breakdown (itemised table)
  breakdown: ExpenseBreakdown;
  food_is_high: boolean;                // "review" badge trigger

  // Savings suggestions
  savings_suggestions: SavingSuggestion[];
  total_potential_savings: number;

  // Guidance tips
  tips: string[];

  // Developer sanity checks
  sanity: Record<string, number>;
}

// HELPERS

/** Convert weekly spend to monthly using accurate 52-week year */
const weeklyToMonthly = (weekly: number): number =>
  round2((weekly * 52) / 12);

/** Round to 2 decimal places */
const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Midpoint of a range */
const midpoint = (lower: number, upper: number): number =>
  round2((lower + upper) / 2);

// SERVICE

@Injectable()
export class CalculateService {
  constructor(
    @InjectRepository(Baseline)
    private readonly baselineRepo: Repository<Baseline>,
    private readonly historyService: HistoryService,
  ) {}

  async calculate(input: CreateCalculateDto): Promise<CalculationResult> {
    // 1. Fetch baseline for this city
    const baseline = await this.baselineRepo.findOne({
      where: { city_id: input.city_id },
    });
    if (!baseline) {
      throw new NotFoundException(
        `No baseline found for city_id ${input.city_id}`,
      );
    }

    const ukvi = Number(baseline.ukvi_baseline);
    const cityMin = Number(baseline.city_minimum);

    // 2. Budget midpoint
    const budgetMid = midpoint(input.budget_lower, input.budget_upper);

    // 3. Rent calculation
    // "Mid" rent is the midpoint of lower/upper, then divided by people sharing
    const rentMid = midpoint(input.rent_lower, input.rent_upper);
    const rentShare = round2(rentMid / input.people_sharing);

    // Lower/upper rent per person (used in savings suggestions)
    const rentLowerShare = round2(input.rent_lower / input.people_sharing);

    // 4. Bills
    // Bills only count separately if NOT included in rent
    const bills = input.bills_included
      ? 0
      : round2(
          Number(input.electricity) +
          Number(input.gas) +
          Number(input.water) +
          Number(input.internet),
        );

    // Council tax: 0 if student exemption is ticked
    const councilTax = input.student_council_tax_exemption ? 0 : 150; // rough average; could be improved with city-specific data

    // 5. Housing total
    const housingMonthly = round2(rentShare + bills + councilTax);

    // 6. Food & drink — all weekly inputs converted to monthly
    const groceriesMonthly = weeklyToMonthly(input.groceries_weekly);
    const mealsOutMonthly = weeklyToMonthly(
      input.meals_out_per_week * input.avg_meal_cost,
    );
    const coffeesMonthly = weeklyToMonthly(
      input.coffees_per_week * input.avg_coffee_cost,
    );
    const foodAndDrinkMonthly = round2(
      groceriesMonthly + mealsOutMonthly + coffeesMonthly,
    );

    // 7. Amortized one-off
    const amortizedMonthly =
      input.amortize_over_months > 0
        ? round2(input.amortized_one_off / input.amortize_over_months)
        : 0;

    // 8. Build breakdown
    const breakdown: ExpenseBreakdown = {
      housing: housingMonthly,
      food_and_drink: foodAndDrinkMonthly,
      transport: Number(input.transport_pass),
      clothing: Number(input.clothing),
      gym: Number(input.gym),
      personal_care: Number(input.personal_care),
      phone: Number(input.phone),
      subscriptions: Number(input.subscriptions),
      health: Number(input.health_insurance),
      other: Number(input.other_recurring),
      amortized_one_off: amortizedMonthly,
    };

    // 9. Typical month subtotal (before buffer)
    const subtotal = round2(
      Object.values(breakdown).reduce((acc, v) => acc + v, 0),
    );

    // 10. Apply buffer
    // Typical month total = subtotal × (1 + buffer)
    const typicalMonthTotal = round2(subtotal * (1 + Number(input.buffer)));

    // 11. First month
    // First month = typical month + deposit + upfront one-off
    const firstMonthTotal = round2(
      typicalMonthTotal + Number(input.deposit) + Number(input.upfront_one_off),
    );

    // 12. Budget checks
    const midpointPctOfUkvi = round2((budgetMid / ukvi) * 100);
    const belowUkvi = budgetMid < ukvi;
    const belowCityMin = budgetMid < cityMin;
    const budgetGapFromUkvi = belowUkvi ? round2(ukvi - budgetMid) : 0;
    const midpointCoversTypical = round2((budgetMid / typicalMonthTotal) * 100);

    // 13. Food "review" badge
    // Flag food as high if it exceeds 30% of the typical month total
    const foodIsHigh = foodAndDrinkMonthly > typicalMonthTotal * 0.3;

    // 14. Savings suggestions
    const gap = round2(ukvi - budgetMid); // shortfall from UKVI baseline
    const suggestions: SavingSuggestion[] = [];

    // Suggestion: Add one more flatmate
    if (input.people_sharing < 4) {
      const extraPersonSaving = round2(
        rentShare - rentShare * (input.people_sharing / (input.people_sharing + 1)),
      );
      if (extraPersonSaving > 0) {
        suggestions.push({
          label: 'Add one more flatmate',
          description: `${input.people_sharing + 1}-person shares often reduce per-person rent.`,
          monthly_saving: extraPersonSaving,
          percentage_of_gap: gap > 0 ? round2((extraPersonSaving / gap) * 100) : 0,
        });
      }
    }

    // Suggestion: Skip monthly pass for PAYG
    if (input.transport_pass > 0) {
      suggestions.push({
        label: 'Skip monthly pass for PAYG',
        description: 'If you ride less, pay-as-you-go caps can be cheaper.',
        monthly_saving: Number(input.transport_pass),
        percentage_of_gap: gap > 0 ? round2((Number(input.transport_pass) / gap) * 100) : 0,
      });
    }

    // Suggestion: Halve meals out
    if (mealsOutMonthly > 0) {
      const mealsSaving = round2(mealsOutMonthly / 2);
      suggestions.push({
        label: 'Halve meals out',
        description: 'Batch-cook; use canteen/union deals.',
        monthly_saving: mealsSaving,
        percentage_of_gap: gap > 0 ? round2((mealsSaving / gap) * 100) : 0,
      });
    }

    // Suggestion: Pick lower rent in your range
    if (input.rent_upper > input.rent_lower) {
      const lowerRentSaving = round2(rentShare - rentLowerShare);
      if (lowerRentSaving > 0) {
        suggestions.push({
          label: 'Pick lower rent in your range',
          description: 'Target lower-bound listings; widen radius; consider older properties.',
          monthly_saving: lowerRentSaving,
          percentage_of_gap: gap > 0 ? round2((lowerRentSaving / gap) * 100) : 0,
        });
      }
    }

    // Suggestion: Halve coffees
    if (coffeesMonthly > 0) {
      const coffeeSaving = round2(coffeesMonthly / 2);
      suggestions.push({
        label: 'Halve coffees',
        description: 'Brew at home; carry a flask.',
        monthly_saving: coffeeSaving,
        percentage_of_gap: gap > 0 ? round2((coffeeSaving / gap) * 100) : 0,
      });
    }

    // Suggestion: Pause gym for a term
    if (input.gym > 0) {
      suggestions.push({
        label: 'Pause gym for a term',
        description: 'Use campus/outdoor alternatives.',
        monthly_saving: Number(input.gym),
        percentage_of_gap: gap > 0 ? round2((Number(input.gym) / gap) * 100) : 0,
      });
    }

    // Sort by saving amount descending
    suggestions.sort((a, b) => b.monthly_saving - a.monthly_saving);

    const totalPotentialSavings = round2(
      suggestions.reduce((acc, s) => acc + s.monthly_saving, 0),
    );

    // 15. Guidance tips
    const tips: string[] = [];

    if (belowUkvi) {
      tips.push(
        `Your midpoint budget is £${round2(ukvi - budgetMid).toLocaleString()} below the UKVI baseline — consider more reserve, scholarships, or higher vacation earnings.`,
      );
    }
    if (belowCityMin) {
      tips.push(
        `Your midpoint budget is £${round2(cityMin - budgetMid).toLocaleString()} below local city starter costs — consider more roommates, a lower rent bound, delaying a monthly pass, fewer meals out.`,
      );
    }
    if (foodIsHigh) {
      tips.push('Food is high — cook more at home and compare supermarkets.');
    }
    tips.push(
      'These are planning estimates; verify rent, fares, council tax, and licensing locally.',
    );

    // 16. Sanity checks (developer panel)
    const sanity = {
      groceries_monthly: groceriesMonthly,
      meals_out_monthly: mealsOutMonthly,
      coffees_monthly: coffeesMonthly,
      food_total_monthly: foodAndDrinkMonthly,
      rent_mid: rentMid,
      rent_share: rentShare,
      bills_monthly: bills,
      subtotal_before_buffer: subtotal,
      buffer_amount: round2(subtotal * Number(input.buffer)),
      typical_month_total: typicalMonthTotal,
      first_month_total: firstMonthTotal,
    };

    const result = {
      ukvi_baseline: ukvi,
      city_minimum: cityMin,
      midpoint_budget: budgetMid,
      midpoint_pct_of_ukvi: midpointPctOfUkvi,
      below_ukvi: belowUkvi,
      below_city_minimum: belowCityMin,
      budget_gap_from_ukvi: budgetGapFromUkvi,
      budget_range_label: `You set £${input.budget_lower}–£${input.budget_upper}; we use the midpoint £${budgetMid} for checks`,

      typical_month_total: typicalMonthTotal,
      first_month_total: firstMonthTotal,

      first_month_rent_share: rentShare,
      typical_rent_share: rentShare,
      deposit: Number(input.deposit),
      upfront_one_off: Number(input.upfront_one_off),

      midpoint_covers_pct_of_typical: midpointCoversTypical,

      breakdown,
      food_is_high: foodIsHigh,

      savings_suggestions: suggestions,
      total_potential_savings: totalPotentialSavings,

      tips,
      sanity,
    };

    // Store in history with full input and result snapshots
    this.historyService.create(input.city_id, input.band, input, result).catch(() => {});
 
    return result;
  }
}