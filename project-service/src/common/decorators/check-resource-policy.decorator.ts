import { SetMetadata } from '@nestjs/common';

import { Action, Resource } from '../constants';

export interface ResourcePolicyConfig {
  action: Action;
  resource: Resource;
  resourceIdParam: string;
  resourceType: 'board' | 'element' | 'project' | 'user';
}

export const CHECK_RESOURCE_POLICY_KEY = 'check_resource_policy';
export const CheckResourcePolicy = (config: ResourcePolicyConfig) =>
  SetMetadata(CHECK_RESOURCE_POLICY_KEY, config);
