import { Reflector } from '@nestjs/core';

import { Role } from '~/types/role.enum';

export const Roles = Reflector.createDecorator<Role[]>();
