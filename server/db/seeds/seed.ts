import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { City } from 'src/entities/city.entity';
import { Baseline } from 'src/entities/baseline.entity';
import { CityPreset } from 'src/entities/city-preset.entity';
import { BASELINES_DATA, CITIES_DATA, PRESETS_DATA } from '../seed.data';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'living_expense',
  entities: [City, CityPreset, Baseline],
  synchronize: true, // creates tables if they don't exist
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const cityRepo = AppDataSource.getRepository(City);
  const presetRepo = AppDataSource.getRepository(CityPreset);
  const baselineRepo = AppDataSource.getRepository(Baseline);

  // Wipe existing data
  await AppDataSource.query('TRUNCATE TABLE "baselines", "city_presets", "cities" CASCADE;');
  console.log('Cleared existing data');

  // Insert cities and related presets/baselines
  for (const cityData of CITIES_DATA) {
    const city = cityRepo.create(cityData);
    const savedCity = await cityRepo.save(city);
    console.log(`Seeded city: ${savedCity.name}`);

    // Insert 3 presets per city (low / typical / high)
    const cityPresets = PRESETS_DATA[savedCity.slug];
    if (!cityPresets) {
      console.warn(`No preset data found for ${savedCity.slug}, skipping`);
      continue;
    }

    for (const presetData of cityPresets) {
      const preset = presetRepo.create({
        ...presetData,
        city_id: savedCity.id,
      });
      await presetRepo.save(preset);
      console.log(`Seeded preset: ${presetData.band}`);
    }

    // Insert baseline for this city
    const baselineData = BASELINES_DATA[savedCity.slug];
    if (baselineData) {
      const baseline = baselineRepo.create({
        city_id: savedCity.id,
        ukvi_baseline: baselineData.ukvi,
        city_minimum: baselineData.minimum,
      });
      await baselineRepo.save(baseline);
      console.log(`Seeded baseline: UKVI £${baselineData.ukvi} / Min £${baselineData.minimum}`);
    }
  }

  console.log('\n Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});