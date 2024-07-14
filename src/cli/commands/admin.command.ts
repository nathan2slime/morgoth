import { faker } from '@faker-js/faker';
import { Command, CommandRunner } from 'nest-commander';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '~/schemas/user.schema';

import { logger } from '~/logger';
import { Role } from '~/types/role.enum';

@Command({ name: 'admin', description: 'Create a user admin' })
export class AdminCommand extends CommandRunner {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super();
  }

  async run() {
    const data = {
      password: faker.internet.password(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: Role.ADMIN,
    };

    await this.userModel.create(data);

    logger.info('user admin created', { data });
  }
}
