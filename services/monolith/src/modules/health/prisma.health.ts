import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly healthIndicator: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicator.check(key);

    return this.prisma.$queryRaw`SELECT 1`
      .then(() => indicator.up())
      .catch((error) => indicator.down((error as Error).message));
  }
}
