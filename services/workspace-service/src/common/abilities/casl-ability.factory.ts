import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Role, User } from 'src/common/interfaces';

import { Action, Resource } from '../constants';

type AppSubjects =
  | Subjects<{
      Project: { id: number; authorId: number | null };
      Board: { id: number; authorId: number | null };
      Element: { id: string; userId: number | null };
      User: { id: number; role: Role };
    }>
  | 'all';

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { build, can } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === Role.ADMIN) {
      can(Action.MANAGE, 'all');
    } else {
      can(Action.MANAGE, Resource.PROJECT, { authorId: user.id });

      can(Action.READ, Resource.PROJECT, { authorId: null });

      can(Action.MANAGE, Resource.BOARD, {
        authorId: user.id,
      });

      can(Action.READ, Resource.BOARD, {
        authorId: null,
      });

      can(Action.MANAGE, Resource.ELEMENT, {
        userId: user.id,
      });

      can(Action.READ, Resource.ELEMENT, {
        userId: null,
      });

      can(Action.READ, Resource.USER, { id: user.id });

      can(Action.UPDATE, Resource.USER, { id: user.id });
    }

    return build();
  }
}
