import { PartialType } from '@nestjs/swagger';
import { CreateCalculateDto } from './create-calculate.dto';

export class UpdateCalculateDto extends PartialType(CreateCalculateDto) {}
