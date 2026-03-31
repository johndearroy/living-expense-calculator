import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { CityPreset } from './city-preset.entity';
import { Baseline } from './baseline.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g. "London"

  @Column()
  country: string; // e.g. "UK"

  @Column({ unique: true })
  slug: string; // e.g. "london"

  // One city has three presets (low, typical, high)
  @OneToMany(() => CityPreset, (preset) => preset.city, { cascade: true })
  presets: CityPreset[];

  // One city has one baseline row
  @OneToMany(() => Baseline, (baseline) => baseline.city, { cascade: true })
  baselines: Baseline[];

  @CreateDateColumn()
  createdAt: Date;
}