import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaselinesService } from './baselines.service';

@ApiTags('Baselines')
@Controller('baselines')
export class BaselinesController {
  constructor(private readonly baselinesService: BaselinesService) {}

  /**
   * GET /api/baselines
   * Optional ?city_id=1 to filter by city
   * Returns UKVI baseline and city minimum amounts
   */
  @Get()
  @ApiOperation({ summary: 'Fetch UKVI and city minimum baselines' })
  @ApiQuery({ name: 'city_id', required: false, type: Number })
  async findAll(@Query('city_id') cityId?: number) {
    const data = await this.baselinesService.findAll(
      cityId ? Number(cityId) : undefined,
    );
    return { success: true, data };
  }
}