import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalculateService } from './calculate.service';
import { CreateCalculateDto } from './dto/create-calculate.dto';

@ApiTags('Calculate')
@Controller('calculate')
export class CalculateController {
  constructor(private readonly calculateService: CalculateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit living expense inputs and receive calculated results',
  })
  @ApiResponse({ status: 200, description: 'Calculation successful' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'City baseline not found' })
  async calculate(@Body() input: CreateCalculateDto) {
    const result = await this.calculateService.calculate(input);
    return { success: true, data: result };
  }
}