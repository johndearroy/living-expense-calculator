import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CalculationHistory } from '../entities/calculation-history.entity'
import { HistoryController } from './history.controller'
import { HistoryService } from './history.service'

@Module({
  imports: [TypeOrmModule.forFeature([CalculationHistory])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}