import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesModule } from './cities/cities.module';
import { PresetsModule } from './presets/presets.module';
import { BaselinesModule } from './baselines/baselines.module';
import { CalculateModule } from './calculate/calculate.module';
import { DatabaseModule } from './database/database.module';
import { City } from './entities/city.entity';
import { CityPreset } from './entities/city-preset.entity';
import { Baseline } from './entities/baseline.entity';
import { CalculationHistory } from './entities/calculation-history.entity';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'db'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'admin'),
        password: config.get('DB_PASSWORD', 'password'),
        database: config.get('DB_NAME', 'neonexor_db'),
        entities: [City, CityPreset, Baseline, CalculationHistory],
        // synchronize: true creates tables automatically from entities.
        // Fine for development; for production use migrations.
        synchronize: true,
        logging: config.get('NODE_ENV') !== 'production',
      }),
    }),

    CitiesModule,

    PresetsModule,

    BaselinesModule,

    CalculateModule,

    DatabaseModule,

    HistoryModule,
  ],
})
export class AppModule {}