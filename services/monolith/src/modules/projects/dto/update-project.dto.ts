import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  description?: string;
}
