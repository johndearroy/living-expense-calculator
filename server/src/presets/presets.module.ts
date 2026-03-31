import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityPreset } from '../entities/city-preset.entity';
import { PresetsController } from './presets.controller';
import { PresetsService } from './presets.service';

@Module({
  imports: [TypeOrmModule.forFeature([CityPreset])],
  controllers: [PresetsController],
  providers: [PresetsService],
})
export class PresetsModule {}