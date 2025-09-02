import { subject } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'generated/prisma';

import { PrismaService } from '../../prisma/prisma.service';
import { AppAbility,CaslAbilityFactory } from '../abilities/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import {
  CHECK_RESOURCE_POLICY_KEY,
  ResourcePolicyConfig,
} from '../decorators/check-resource-policy.decorator';

export type PolicyHandler = (
  ability: AppAbility,
  context: ExecutionContext,
) => Promise<boolean> | boolean;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    const ability = this.caslAbilityFactory.createForUser(user);

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    if (policyHandlers.length) {
      const results = await Promise.all(
        policyHandlers.map((handler) => this.execPolicyHandler(handler, ability, context)),
      );

      if (!results.every((result) => result === true)) {
        return false;
      }
    }

    const resourcePolicyConfig = this.reflector.get<ResourcePolicyConfig>(
      CHECK_RESOURCE_POLICY_KEY,
      context.getHandler(),
    );

    if (resourcePolicyConfig) {
      return await this.checkResourcePolicy(ability, context, resourcePolicyConfig);
    }

    return true;
  }

  private async execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    context: ExecutionContext,
  ): Promise<boolean> {
    const result = handler(ability, context);

    if (result instanceof Promise) {
      return await result;
    }

    return result;
  }

  private async checkResourcePolicy(
    ability: AppAbility,
    context: ExecutionContext,
    config: ResourcePolicyConfig,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user: User; params: Record<string, string> }>();
    const resourceId = Number(request.params[config.resourceIdParam]);

    if (isNaN(resourceId)) {
      throw new NotFoundException('Resource not found');
    }

    let resource;

    switch (config.resourceType) {
      case 'board': {
        const projectId = Number(request.params.projectId);

        if (
          isNaN(projectId) ||
          !(await this.prismaService.project.findUnique({ where: { id: projectId } }))
        ) {
          throw new NotFoundException('Resource not found');
        }

        resource = await this.prismaService.board.findUnique({
          where: { id: resourceId },
        });
        break;
      }

      case 'project': {
        resource = await this.prismaService.project.findUnique({
          where: { id: resourceId },
        });
        break;
      }

      case 'user': {
        resource = await this.prismaService.user.findUnique({
          where: { id: resourceId },
        });
        break;
      }

      default: {
        throw new NotFoundException('Resource not found');
      }
    }

    if (!resource) throw new NotFoundException('Resource not found');

    return ability.can(config.action, subject(config.resource, resource));
  }
}
