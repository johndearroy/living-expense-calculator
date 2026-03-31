import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CalculationHistory } from '../entities/calculation-history.entity'

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(CalculationHistory)
    private readonly repo: Repository<CalculationHistory>,
  ) {}

  async create(cityId: number, band: string, input: object, result: any): Promise<CalculationHistory> {
    const record = this.repo.create({
      city_id: cityId,
      band,
      input_snapshot: input,
      result_snapshot: result,
      typical_month_total: result.typical_month_total,
      first_month_total: result.first_month_total,
      midpoint_budget: result.midpoint_budget,
      below_ukvi: result.below_ukvi,
    })
    return this.repo.save(record)
  }

  async findAll(): Promise<CalculationHistory[]> {
    return this.repo.find({
      relations: ['city'],
      order: { created_at: 'DESC' },
      select: {
        id: true,
        band: true,
        typical_month_total: true,
        first_month_total: true,
        midpoint_budget: true,
        below_ukvi: true,
        created_at: true,
        city: { id: true, name: true },
      },
    })
  }

  async findOne(id: number): Promise<CalculationHistory> {
    const record = await this.repo.findOne({
      where: { id },
      relations: ['city'],
    })
    if (!record) throw new NotFoundException(`History record ${id} not found`)
    return record
  }

  async deleteOne(id: number): Promise<void> {
    const record = await this.repo.findOne({ where: { id } })
    if (!record) throw new NotFoundException(`History record ${id} not found`)
    await this.repo.remove(record)
  }

  async deleteAll(): Promise<void> {
    await this.repo.clear()
  }
}