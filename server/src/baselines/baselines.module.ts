import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Baseline } from '../entities/baseline.entity';
import { BaselinesController } from './baselines.controller';
import { BaselinesService } from './baselines.service';

@Module({
  imports: [TypeOrmModule.forFeature([Baseline])],
  controllers: [BaselinesController],
  providers: [BaselinesService],
})
export class BaselinesModule {}