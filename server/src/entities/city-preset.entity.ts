import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

export type Band = 'low' | 'typical' | 'high';

@Entity('city_presets')
export class CityPreset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => City, (city) => city.presets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column()
  city_id: number;

  // low | typical | high
  @Column({ type: 'varchar', length: 10 })
  band: Band;

  // Housing 
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rent_lower: number; // £/mo lower bound

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rent_upper: number; // £/mo upper bound

  @Column({ type: 'int', default: 2 })
  people_sharing: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  electricity: number; // £/mo

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gas: number; // £/mo

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  water: number; // £/mo

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  internet: number; // £/mo

  @Column({ type: 'boolean', default: false })
  bills_included: boolean;

  @Column({ type: 'boolean', default: true })
  student_council_tax_exemption: boolean;

  // Budget 
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget_lower: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget_upper: number;

  // Food & Drink (weekly) 
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  groceries_weekly: number;

  @Column({ type: 'int', default: 2 })
  meals_out_per_week: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  avg_meal_cost: number;

  @Column({ type: 'int', default: 5 })
  coffees_per_week: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  avg_coffee_cost: number;

  // Transport 
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  transport_pass: number; // £/mo (0 = none)

  // Other Recurring 
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  phone: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  health_insurance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gym: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subscriptions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  clothing: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  personal_care: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  other_recurring: number;

  // Upfront / Amortized / Buffer
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500 })
  upfront_one_off: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amortized_one_off: number;

  @Column({ type: 'int', default: 12 })
  amortize_over_months: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.1 })
  buffer: number; // 0–1 (e.g. 0.1 = 10%)

  // Housing type label
  @Column({ type: 'varchar', length: 50, default: 'Shared room' })
  housing_type: string;

  // Deposit (user's share)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 975 })
  deposit: number;
}