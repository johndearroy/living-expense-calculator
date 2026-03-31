import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// All fields optional — PATCH-style update even though it's PUT
export class UpdatePresetDto {
  @IsOptional() @IsNumber() @Type(() => Number) rent_lower?: number;
  @IsOptional() @IsNumber() @Type(() => Number) rent_upper?: number;
  @IsOptional() @IsNumber() @Type(() => Number) people_sharing?: number;
  @IsOptional() @IsNumber() @Type(() => Number) deposit?: number;
  @IsOptional() @IsBoolean() bills_included?: boolean;
  @IsOptional() @IsNumber() @Type(() => Number) electricity?: number;
  @IsOptional() @IsNumber() @Type(() => Number) gas?: number;
  @IsOptional() @IsNumber() @Type(() => Number) water?: number;
  @IsOptional() @IsNumber() @Type(() => Number) internet?: number;
  @IsOptional() @IsBoolean() student_council_tax_exemption?: boolean;
  @IsOptional() @IsNumber() @Type(() => Number) budget_lower?: number;
  @IsOptional() @IsNumber() @Type(() => Number) budget_upper?: number;
  @IsOptional() @IsNumber() @Type(() => Number) groceries_weekly?: number;
  @IsOptional() @IsNumber() @Type(() => Number) meals_out_per_week?: number;
  @IsOptional() @IsNumber() @Type(() => Number) avg_meal_cost?: number;
  @IsOptional() @IsNumber() @Type(() => Number) coffees_per_week?: number;
  @IsOptional() @IsNumber() @Type(() => Number) avg_coffee_cost?: number;
  @IsOptional() @IsNumber() @Type(() => Number) transport_pass?: number;
  @IsOptional() @IsNumber() @Type(() => Number) phone?: number;
  @IsOptional() @IsNumber() @Type(() => Number) health_insurance?: number;
  @IsOptional() @IsNumber() @Type(() => Number) gym?: number;
  @IsOptional() @IsNumber() @Type(() => Number) subscriptions?: number;
  @IsOptional() @IsNumber() @Type(() => Number) clothing?: number;
  @IsOptional() @IsNumber() @Type(() => Number) personal_care?: number;
  @IsOptional() @IsNumber() @Type(() => Number) other_recurring?: number;
  @IsOptional() @IsNumber() @Type(() => Number) upfront_one_off?: number;
  @IsOptional() @IsNumber() @Type(() => Number) amortized_one_off?: number;
  @IsOptional() @IsNumber() @Type(() => Number) amortize_over_months?: number;
  @IsOptional() @IsNumber() @Type(() => Number) buffer?: number;
  @IsOptional() @IsString() housing_type?: string;
}