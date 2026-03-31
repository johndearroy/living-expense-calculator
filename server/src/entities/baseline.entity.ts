import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('baselines')
export class Baseline {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => City, (city) => city.baselines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column()
  city_id: number;

  // UKVI (Home Office) required monthly maintenance amount for international students
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ukvi_baseline: number; // e.g. 1483

  // Practical local minimum — what the city actually costs at bare minimum
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  city_minimum: number; // e.g. 1262
}