import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '~/app/auth/auth.service';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { JwtAuthGuard } from '~/app/auth/auth.guard';
import { AUTH_COOKIE } from '~/constants';
import { Session } from '~/schemas/session.schema';
import { Entity } from '~/types';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Create a new user' })
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const data = await this.authService.signUp(body);

    const { accessToken, refreshToken } = data;
    res.cookie(AUTH_COOKIE, { accessToken, refreshToken }, { httpOnly: true });

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get the authenticated user',
  })
  async auth(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json(req.user);
  }

  @Post('signout')
  @ApiResponse({
    status: 200,
    description: 'Signs out the logged in user',
  })
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req: Request, @Res() res: Response) {
    const session = req.user as Entity<Session>;
    await this.authService.signOut(session);
    return res.status(HttpStatus.OK).send();
  }

  @Patch('refresh')
  @UseGuards(AuthGuard('refresh'))
  @ApiResponse({
    status: 200,
    description: 'Update access token by refresh token',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const session = req.user as Session;
    const { accessToken, refreshToken } = session;

    res.cookie(AUTH_COOKIE, { accessToken, refreshToken }, { httpOnly: true });

    return res.status(HttpStatus.OK).json(session);
  }

  @Post('signin')
  @ApiResponse({ status: 200, description: 'Sign in user' })
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    const data = await this.authService.signIn(body);

    const { accessToken, refreshToken } = data;
    res.cookie(AUTH_COOKIE, { accessToken, refreshToken }, { httpOnly: true });

    return res.status(HttpStatus.OK).json(data);
  }
}
