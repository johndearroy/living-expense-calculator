export type Band = 'low' | 'typical' | 'high'

export type HousingType = 'Shared room' | 'Studio' | '1-bed' | '2-bed'

export type City = {
  id: number
  name: string
  slug: string
  country: string
}

export type CityPreset = {
  id: number
  city_id: number
  band: Band
  housing_type: string
  rent_lower: number
  rent_upper: number
  people_sharing: number
  deposit: number
  bills_included: boolean
  student_council_tax_exemption: boolean
  electricity: number
  gas: number
  water: number
  internet: number
  budget_lower: number
  budget_upper: number
  groceries_weekly: number
  meals_out_per_week: number
  avg_meal_cost: number
  coffees_per_week: number
  avg_coffee_cost: number
  transport_pass: number
  phone: number
  health_insurance: number
  gym: number
  subscriptions: number
  clothing: number
  personal_care: number
  other_recurring: number
  upfront_one_off: number
  amortized_one_off: number
  amortize_over_months: number
  buffer: number
}

export type CalculateInput = {
  city_id: number
  housing_type: HousingType
  band: Band
  budget_lower: number
  budget_upper: number
  people_sharing: number
  rent_lower: number
  rent_upper: number
  deposit: number
  bills_included: boolean
  electricity: number
  gas: number
  water: number
  internet: number
  student_council_tax_exemption: boolean
  groceries_weekly: number
  meals_out_per_week: number
  avg_meal_cost: number
  coffees_per_week: number
  avg_coffee_cost: number
  transport_pass: number
  phone: number
  health_insurance: number
  gym: number
  subscriptions: number
  clothing: number
  personal_care: number
  other_recurring: number
  upfront_one_off: number
  amortized_one_off: number
  amortize_over_months: number
  buffer: number
}

export type ExpenseBreakdown = {
  housing: number
  food_and_drink: number
  transport: number
  clothing: number
  gym: number
  personal_care: number
  phone: number
  subscriptions: number
  health: number
  other: number
  amortized_one_off: number
}

export type SavingSuggestion = {
  label: string
  description: string
  monthly_saving: number
  percentage_of_gap: number
}

export type CalculationResult = {
  ukvi_baseline: number
  city_minimum: number
  midpoint_budget: number
  midpoint_pct_of_ukvi: number
  below_ukvi: boolean
  below_city_minimum: boolean
  budget_gap_from_ukvi: number
  budget_range_label: string
  typical_month_total: number
  first_month_total: number
  first_month_rent_share: number
  typical_rent_share: number
  deposit: number
  upfront_one_off: number
  midpoint_covers_pct_of_typical: number
  breakdown: ExpenseBreakdown
  food_is_high: boolean
  savings_suggestions: SavingSuggestion[]
  total_potential_savings: number
  tips: string[]
  sanity: Record<string, number>
}