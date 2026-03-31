import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { HistoryService } from './history.service'

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all calculation history (latest first)' })
  @ApiResponse({ status: 200, description: 'List of history records' })
  async findAll() {
    const data = await this.historyService.findAll()
    return { success: true, data }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one history record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'History record with full input and result snapshots' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.historyService.findOne(id)
    return { success: true, data }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all history records' })
  @ApiResponse({ status: 200, description: 'All records deleted' })
  async deleteAll() {
    await this.historyService.deleteAll()
    return { success: true, message: 'All history deleted' }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete one history record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Record deleted' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    await this.historyService.deleteOne(id)
    return { success: true, message: `History record ${id} deleted` }
  }
}