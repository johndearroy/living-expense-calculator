import { PartialType } from '@nestjs/swagger';
import { CreateBaselineDto } from './create-baseline.dto';

export class UpdateBaselineDto extends PartialType(CreateBaselineDto) {}
