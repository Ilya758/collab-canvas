import { IsEnum, IsObject } from 'class-validator';
import { ElementType } from 'generated/prisma';

export class ElementDto {
  @IsEnum(ElementType)
  type: ElementType;

  @IsObject()
  config: Record<string, any>;
}
