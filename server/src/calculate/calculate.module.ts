import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Baseline } from '../entities/baseline.entity';
import { CalculateController } from './calculate.controller';
import { CalculateService } from './calculate.service';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Baseline]), HistoryModule],
  controllers: [CalculateController],
  providers: [CalculateService],
})

export class CalculateModule {}