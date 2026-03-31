import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityPreset } from '../entities/city-preset.entity';

@Injectable()
export class PresetsService {
  constructor(
    @InjectRepository(CityPreset)
    private readonly presetRepo: Repository<CityPreset>,
  ) {}

  async update(id: number, dto: Partial<CityPreset>): Promise<CityPreset> {
    const preset = await this.presetRepo.findOne({ where: { id } });
    if (!preset) throw new NotFoundException(`Preset ${id} not found`);
    Object.assign(preset, dto);
    return this.presetRepo.save(preset);
  }

  async remove(id: number): Promise<void> {
    const preset = await this.presetRepo.findOne({ where: { id } });
    if (!preset) throw new NotFoundException(`Preset ${id} not found`);
    await this.presetRepo.remove(preset);
  }
}