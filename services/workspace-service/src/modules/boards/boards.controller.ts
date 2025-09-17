import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { BoardsService } from './boards.service';
import { type CreateBoardDto } from './dto/create-board.dto';
import { type UpdateBoardDto } from './dto/update-board.dto';
import { type User } from 'src/common/interfaces';
import { GrpcUser } from 'src/common/decorators/grpc-user.decorator';
import { from } from 'rxjs';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckResourcePolicy } from 'src/common/decorators/check-resource-policy.decorator';
import { Resource } from 'src/common/constants/resource';
import { Action } from 'src/common/constants/action';

@Controller()
@UseGuards(PoliciesGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @GrpcMethod('BoardService', 'CreateBoard')
  @CheckResourcePolicy({
    action: Action.MANAGE,
    resource: Resource.PROJECT,
    resourceIdParam: 'projectId',
    resourceType: 'project',
  })
  createBoard(@Payload() data: CreateBoardDto, @GrpcUser() user: User) {
    return this.boardsService.create(data, user.id);
  }

  @GrpcMethod('BoardService', 'FindBoardsByProjectId')
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.PROJECT,
    resourceIdParam: 'projectId',
    resourceType: 'project',
  })
  async findBoardsByProjectId(@Payload() data: { projectId: number }, @GrpcUser() user: User) {
    return from(await this.boardsService.findAllByProjectId(data.projectId, user.id));
  }

  @GrpcMethod('BoardService', 'UpdateBoard')
  @CheckResourcePolicy(
    {
      action: Action.READ,
      resource: Resource.PROJECT,
      resourceIdParam: 'projectId',
      resourceType: 'project',
    },
    {
      action: Action.UPDATE,
      resource: Resource.BOARD,
      resourceIdParam: 'id',
      resourceType: 'board',
    },
  )
  updateBoard(@Payload() data: UpdateBoardDto) {
    return this.boardsService.update(data);
  }

  @GrpcMethod('BoardService', 'DeleteBoard')
  @CheckResourcePolicy({
    action: Action.DELETE,
    resource: Resource.BOARD,
    resourceIdParam: 'id',
    resourceType: 'board',
  })
  deleteBoard(@Payload() data: { id: number; projectId: number }) {
    return this.boardsService.remove(data.id, data.projectId);
  }
}
