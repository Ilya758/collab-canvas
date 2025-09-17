import { subject } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../modules/prisma/prisma.service';
import { AppAbility, CaslAbilityFactory } from '../abilities/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import {
  CHECK_RESOURCE_POLICY_KEY,
  ResourcePolicyConfig,
} from '../decorators/check-resource-policy.decorator';
import { User } from '../interfaces';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

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
    const metadata: Metadata = context.switchToRpc().getContext();
    const userJson = metadata.get('user');

    if (!userJson) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'User not found in metadata',
      });
    }

    const user: User = JSON.parse(userJson.toString());
    const ability = this.caslAbilityFactory.createForUser(user);

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    if (policyHandlers.length) {
      const results = await Promise.all(
        policyHandlers.map((handler) => this.execPolicyHandler(handler, ability, context)),
      );

      if (!results.every((result) => result === true)) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: `You don't have permission to perform this action`,
        });
      }
    }

    const resourcePolicyConfigs = this.reflector.get<ResourcePolicyConfig[]>(
      CHECK_RESOURCE_POLICY_KEY,
      context.getHandler(),
    );

    if (resourcePolicyConfigs?.length) {
      const results = await Promise.all(
        resourcePolicyConfigs.map((config) => this.checkResourcePolicy(ability, context, config)),
      );

      if (!results.every((result) => result)) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'Forbidden',
        });
      }
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
    const data = context.switchToRpc().getData();
    const resourceId = Number(data[config.resourceIdParam]);

    let resource;

    switch (config.resourceType) {
      case 'board': {
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

      case 'element': {
        resource = await this.prismaService.element.findUnique({
          where: { id: data[config.resourceIdParam] },
        });
        break;
      }

      default: {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Resource not found',
        });
      }
    }

    if (!resource)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Resource not found',
      });

    if (!ability.can(config.action, subject(config.resource, resource))) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Forbidden',
      });
    }

    return true;
  }
}
