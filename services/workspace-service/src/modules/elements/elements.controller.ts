import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ElementsService } from './elements.service';
import { type ElementDto } from './dto/element-dto';
import { type User } from 'src/common/interfaces';
import { GrpcUser } from 'src/common/decorators/grpc-user.decorator';
import { from } from 'rxjs';
import { CheckResourcePolicy } from 'src/common/decorators/check-resource-policy.decorator';
import { Action } from 'src/common/constants/action';
import { Resource } from 'src/common/constants/resource';
import { PoliciesGuard } from 'src/common/guards/policies.guard';

@Controller()
@UseGuards(PoliciesGuard)
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @GrpcMethod('ElementService', 'CreateElement')
  @CheckResourcePolicy({
    action: Action.MANAGE,
    resource: Resource.BOARD,
    resourceIdParam: 'boardId',
    resourceType: 'board',
  })
  createElement(@Payload() data: ElementDto, @GrpcUser() user: User) {
    return this.elementsService.create(data, user.id);
  }

  @GrpcMethod('ElementService', 'FindElementsByBoardId')
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.BOARD,
    resourceIdParam: 'boardId',
    resourceType: 'board',
  })
  async findElementsByBoardId(@Payload() data: { boardId: number }, @GrpcUser() user: User) {
    return from(await this.elementsService.findAll(data.boardId, user.id));
  }

  @GrpcMethod('ElementService', 'UpdateElement')
  @CheckResourcePolicy(
    {
      action: Action.READ,
      resource: Resource.BOARD,
      resourceIdParam: 'boardId',
      resourceType: 'board',
    },
    {
      action: Action.UPDATE,
      resource: Resource.ELEMENT,
      resourceIdParam: 'id',
      resourceType: 'element',
    },
  )
  updateElement(@Payload() data: ElementDto) {
    return this.elementsService.update(data);
  }

  @GrpcMethod('ElementService', 'DeleteElement')
  @CheckResourcePolicy({
    action: Action.DELETE,
    resource: Resource.ELEMENT,
    resourceIdParam: 'id',
    resourceType: 'element',
  })
  deleteElement(data: { id: string; boardId: number }) {
    return this.elementsService.remove(data.boardId, data.id);
  }
}
