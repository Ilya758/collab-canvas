import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RpcException, type ClientGrpc } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/common/interfaces/auth-service.interface';
import { type AuthenticatedSocket } from 'src/common/interfaces';

@Injectable()
export class WsAuthMiddleware implements OnModuleInit {
  private authService: AuthService;
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  create() {
    return async (client: AuthenticatedSocket, next: (err?: Error) => void) => {
      try {
        const { token } = client.handshake.query;

        if (!token) {
          throw new RpcException({
            code: GrpcStatus.UNAUTHENTICATED,
            message: 'Authentication token not provided.',
          });
        }

        const user = await firstValueFrom(
          this.authService.validateToken({ accessToken: token as string }),
        );

        if (!user) {
          throw new RpcException({
            code: GrpcStatus.UNAUTHENTICATED,
            message: 'User not found or token invalid.',
          });
        }

        client.data.user = user;

        next();
      } catch (error) {
        console.error(
          `Authentication failed for socket ${client.id}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );

        client.disconnect();
      }
    };
  }
}
