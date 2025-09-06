import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ElementType } from 'generated/prisma';

export class ElementDto {
  @IsEnum(ElementType)
  type: ElementType;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsString()
  content: string;
}
