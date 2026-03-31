import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { City } from './city.entity'

@Entity('calculation_history')
export class CalculationHistory {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => City, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'city_id' })
  city: City

  @Column({ nullable: true })
  city_id: number

  @Column({ type: 'varchar', length: 20 })
  band: string

  // store the full input as JSON so we can replay or review it
  @Column({ type: 'jsonb' })
  input_snapshot: object

  // store the full result as JSON
  @Column({ type: 'jsonb' })
  result_snapshot: object

  // a few indexed columns for quick list display without parsing JSON
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  typical_month_total: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  first_month_total: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  midpoint_budget: number

  @Column({ type: 'boolean', default: false })
  below_ukvi: boolean

  @CreateDateColumn()
  created_at: Date
}