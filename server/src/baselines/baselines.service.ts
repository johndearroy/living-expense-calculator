import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baseline } from '../entities/baseline.entity';

@Injectable()
export class BaselinesService {
  constructor(
    @InjectRepository(Baseline)
    private readonly baselineRepo: Repository<Baseline>,
  ) {}

  async findAll(cityId?: number) {
    const where = cityId ? { city_id: cityId } : {};
    return this.baselineRepo.find({
      where,
      relations: ['city'],
      select: {
        id: true,
        city_id: true,
        ukvi_baseline: true,
        city_minimum: true,
        city: { id: true, name: true, slug: true },
      },
    });
  }
}