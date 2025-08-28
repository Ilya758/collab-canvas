import { Injectable, NotFoundException, PipeTransform, Type } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

type EntityName = 'board' | 'project';

export function EntityExistsPipe(entity: EntityName, field: 'id' = 'id'): Type<PipeTransform> {
  @Injectable()
  class MixinEntityExistsPipe implements PipeTransform<string, Promise<number>> {
    constructor(private readonly prisma: PrismaService) {}

    async transform(value: string): Promise<number> {
      const id = Number(value);

      if (!Number.isFinite(id)) {
        throw new NotFoundException('Resource not found');
      }

      const repo = this.prisma[entity] as unknown as {
        findUnique: (args: { where: Record<string, number> }) => Promise<unknown>;
      };

      if (!repo || typeof repo.findUnique !== 'function') {
        throw new NotFoundException('Resource not found');
      }

      const record = await repo.findUnique({ where: { [field]: id } });

      if (!record) {
        throw new NotFoundException('Resource not found');
      }

      return id;
    }
  }

  return MixinEntityExistsPipe;
}
