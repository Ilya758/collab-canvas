import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { Action, Resource } from 'src/common/constants';
import { CheckResourcePolicy } from 'src/common/decorators/check-resource-policy.decorator';
import { PoliciesGuard } from 'src/common/guards/policies.guard';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ElementDto } from './dto/element-dto';
import { ElementsService } from './elements.service';

@Controller('boards/:boardId/elements')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckResourcePolicy({
    action: Action.MANAGE,
    resource: Resource.BOARD,
    resourceIdParam: 'boardId',
    resourceType: 'board',
  })
  create(
    @Body() elementDto: ElementDto,
    @Param('boardId') boardId: number,
    @Req() { user }: Request & { user: User },
  ) {
    return this.elementsService.create(elementDto, boardId, user.id);
  }

  @Get()
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.BOARD,
    resourceIdParam: 'boardId',
    resourceType: 'board',
  })
  findAll(@Param('boardId') boardId: number, @Req() { user }: Request & { user: User }) {
    return this.elementsService.findAll(boardId, user.id);
  }

  @Get(':id')
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.ELEMENT,
    resourceIdParam: 'id',
    resourceType: 'element',
  })
  findOne(
    @Param('boardId') boardId: number,
    @Param('id') id: string,
    @Req() { user }: Request & { user: User },
  ) {
    return this.elementsService.findOne(boardId, id, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckResourcePolicy({
    action: Action.UPDATE,
    resource: Resource.ELEMENT,
    resourceIdParam: 'id',
    resourceType: 'element',
  })
  update(
    @Param('boardId') boardId: number,
    @Param('id') id: string,
    @Body() updateElementDto: ElementDto,
  ) {
    return this.elementsService.update(boardId, id, updateElementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckResourcePolicy({
    action: Action.DELETE,
    resource: Resource.ELEMENT,
    resourceIdParam: 'id',
    resourceType: 'element',
  })
  remove(@Param('boardId') boardId: number, @Param('id') id: string) {
    return this.elementsService.remove(boardId, id);
  }
}
