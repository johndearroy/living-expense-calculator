import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { CityPreset } from '../entities/city-preset.entity';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

@Module({
  imports: [TypeOrmModule.forFeature([City, CityPreset])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}