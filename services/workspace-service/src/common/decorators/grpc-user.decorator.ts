import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { User } from '../interfaces';

export const GrpcUser = createParamDecorator((_: unknown, ctx: ExecutionContext): User => {
  const metadata: Metadata = ctx.switchToRpc().getContext();
  const userJson = metadata.get('user')[0];

  if (!userJson) {
    throw new RpcException('User not found in metadata');
  }

  try {
    const user: User = JSON.parse(userJson.toString());
    return user;
  } catch (e) {
    throw new RpcException('Invalid user JSON in metadata');
  }
});
