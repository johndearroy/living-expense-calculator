// ─── presets.controller.ts ────────────────────────────────────────────────────
import {
  Controller, Put, Delete, Param, Body,
  ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PresetsService } from './presets.service';
import { UpdatePresetDto } from './dto/update-preset.dto';

@ApiTags('Presets')
@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  /** PUT /api/presets/:id — update a preset */
  @Put(':id')
  @ApiOperation({ summary: 'Update a city preset' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePresetDto,
  ) {
    const updated = await this.presetsService.update(id, dto);
    return { success: true, data: updated };
  }

  /** DELETE /api/presets/:id — remove a preset */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a city preset' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.presetsService.remove(id);
    return { success: true, message: `Preset ${id} deleted` };
  }
}