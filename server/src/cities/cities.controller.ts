import {
  Controller, Get, Param, ParseIntPipe, Query, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CitiesService } from './cities.service';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  /** GET /api/cities — list all cities */
  @Get()
  @ApiOperation({ summary: 'List all available cities' })
  async findAll() {
    const cities = await this.citiesService.findAll();
    return { success: true, data: cities };
  }

  /** GET /api/cities/:id/preset?band=typical — preset values for a city + band */
  @Get(':id/preset')
  @ApiOperation({ summary: 'Get preset values for a city and band' })
  @ApiQuery({ name: 'band', enum: ['low', 'typical', 'high'], required: false })
  async getPreset(
    @Param('id', ParseIntPipe) id: number,
    @Query('band') band: 'low' | 'typical' | 'high' = 'typical',
  ) {
    const preset = await this.citiesService.getPreset(id, band);
    return { success: true, data: preset };
  }
}