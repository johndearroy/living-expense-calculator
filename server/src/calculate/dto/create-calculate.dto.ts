import {
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCalculateDto {
  @ApiProperty({ example: 1, description: 'City ID from /api/cities' })
  @IsNumber()
  @Type(() => Number)
  city_id: number;

  @ApiProperty({ example: 'typical', enum: ['low', 'typical', 'high'] })
  @IsString()
  band: 'low' | 'typical' | 'high';

  @ApiProperty({ example: 600 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  budget_lower: number;

  @ApiProperty({ example: 700 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  budget_upper: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  people_sharing: number;

  @ApiProperty({ example: 900 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rent_lower: number;

  @ApiProperty({ example: 1050 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rent_upper: number;

  @ApiProperty({ example: 975, description: "User's share of deposit" })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  deposit: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  bills_included: boolean;

  @ApiPropertyOptional({ example: 48 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  electricity: number = 0;

  @ApiPropertyOptional({ example: 36 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  gas: number = 0;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  water: number = 0;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  internet: number = 0;

  @ApiProperty({ example: true })
  @IsBoolean()
  student_council_tax_exemption: boolean;

  // Food & drink
  @ApiProperty({ example: 43.85 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  groceries_weekly: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  meals_out_per_week: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  avg_meal_cost: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  coffees_per_week: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  avg_coffee_cost: number;

  // Transport
  @ApiProperty({ example: 172, description: '0 = none (PAYG)' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  transport_pass: number;

  // Other recurring
  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  phone: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  health_insurance: number = 0;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  gym: number = 0;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  subscriptions: number = 0;

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  clothing: number = 0;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  personal_care: number = 0;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  other_recurring: number = 0;

  // Upfront / amortized / buffer
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  upfront_one_off: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amortized_one_off: number = 0;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amortize_over_months: number = 12;

  @ApiPropertyOptional({ example: 0.1, description: '0–1 buffer multiplier' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  buffer: number = 0;
}