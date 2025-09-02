import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { CaslAbilityFactory } from './abilities/casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [PoliciesGuard, CaslAbilityFactory],
  exports: [PoliciesGuard, CaslAbilityFactory],
})
export class CommonModule {}
