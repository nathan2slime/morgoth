import {
  Body,
  Controller,
  HttpStatus,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { UserService } from '~/app/user/user.service';
import { JwtAuthGuard } from '~/app/auth/auth.guard';
import { UpdateUserProfileDto } from '~/app/user/user.dto';
import { Session } from '~/schemas/session.schema';
import { Entity } from '~/types';
import { User } from '~/schemas/user.schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Update user profile data',
  })
  async update(
    @Body() body: UpdateUserProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = req.user as Session;
    const user = session.user as Entity<User>;

    const data = await this.userService.getByIdUpdate(user._id, body);

    return res.status(HttpStatus.OK).json(data);
  }
}
