import { ElementType } from 'generated/prisma';

export interface ElementDto {
  type: ElementType;
  config: string;
  boardId: number;
  id: string;
}
