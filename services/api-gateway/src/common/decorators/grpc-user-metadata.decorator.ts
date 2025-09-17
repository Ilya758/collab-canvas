import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { User } from '../interfaces';

export const GrpcUserMetadata = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Metadata => {
    const { user } = ctx.switchToHttp().getRequest<{ user: User }>();
    const metadata = new Metadata();

    if (user) {
      metadata.set('user', JSON.stringify(user));
    }

    return metadata;
  },
);
