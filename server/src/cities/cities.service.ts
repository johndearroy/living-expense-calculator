import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { CityPreset } from '../entities/city-preset.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,

    @InjectRepository(CityPreset)
    private readonly presetRepo: Repository<CityPreset>,
  ) {}

  /** Return all cities (id, name, slug only — lightweight for dropdown) */
  async findAll() {
    return this.cityRepo.find({
      select: ['id', 'name', 'country', 'slug'],
      order: { name: 'ASC' },
    });
  }

  /** Return the preset for a specific city + band */
  async getPreset(cityId: number, band: 'low' | 'typical' | 'high') {
    const city = await this.cityRepo.findOne({ where: { id: cityId } });
    if (!city) throw new NotFoundException(`City with id ${cityId} not found`);

    const preset = await this.presetRepo.findOne({
      where: { city_id: cityId, band },
    });
    if (!preset) {
      throw new NotFoundException(
        `No ${band} preset found for city ${city.name}`,
      );
    }

    return preset;
  }
}