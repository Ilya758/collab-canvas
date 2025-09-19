import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WsAuthMiddleware } from './ws-auth.middleware';
import { type AuthenticatedSocket } from 'src/common/interfaces';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly wsAuthMiddleware: WsAuthMiddleware) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.create());
  }

  handleDisconnect(client: Socket) {
    this.server
      .to(client.id)
      .emit('disconnected', `Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinBoard')
  handleJoinBoard(client: AuthenticatedSocket, payload: { boardId: string }) {
    client.join(payload.boardId);
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(client: AuthenticatedSocket, payload: { boardId: string }) {
    client.leave(payload.boardId);
  }
}
