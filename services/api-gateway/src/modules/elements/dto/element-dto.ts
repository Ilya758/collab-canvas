import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ElementType } from './element-type';

export class ElementDto {
  @IsNumber()
  @IsOptional()
  boardId?: number;

  @IsString()
  config: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(ElementType)
  type: ElementType;
}
