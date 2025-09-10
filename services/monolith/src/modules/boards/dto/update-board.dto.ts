import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  name?: string;
}
