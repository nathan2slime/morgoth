import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '~/app/auth/auth.decorator';
import { Session } from '~/schemas/session.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (roles) {
      const req = context.switchToHttp().getRequest();
      const session = req.user as Session;

      return roles.includes(session.user.role);
    }

    return true;
  }
}
