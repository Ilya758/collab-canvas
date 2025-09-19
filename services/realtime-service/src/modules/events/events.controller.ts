import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Controller()
export class EventsController {
  constructor(private readonly gateway: RealtimeGateway) {}

  @EventPattern('element_created')
  handleElementCreated(@Payload() data: any) {
    const { boardId } = data;

    if (!boardId) {
      return;
    }

    const roomName = String(boardId);
    this.gateway.server.to(roomName).emit('element_created', data);
  }

  @EventPattern('element_updated')
  handleElementUpdated(@Payload() data: any) {
    const { boardId } = data;

    if (!boardId) {
      return;
    }

    const roomName = String(boardId);
    this.gateway.server.to(roomName).emit('element_updated', data);
  }

  @EventPattern('element_deleted')
  handleElementDeleted(@Payload() data: any) {
    const { boardId } = data;

    if (!boardId) {
      return;
    }

    const roomName = String(boardId);
    this.gateway.server.to(roomName).emit('element_deleted', data);
  }
}
