import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '~/app/auth/auth.service';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { JwtAuthGuard } from '~/app/auth/auth.guard';
import { AUTH_COOKIE } from '~/constants';
import { Session } from '~/schemas/session.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const data = await this.authService.signUp(body);

    const { accessToken, refreshToken } = data;
    res.cookie(AUTH_COOKIE, { accessToken, refreshToken }, { httpOnly: true });

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async auth(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json(req.user);
  }

  @Get('refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: Request, @Res() res: Response) {
    const session = req.user as Session;
    const { accessToken, refreshToken } = session;

    res.cookie(AUTH_COOKIE, { accessToken, refreshToken }, { httpOnly: true });

    return res.status(HttpStatus.OK).json(session);
  }

  @Post('signin')
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    const data = await this.authService.signIn(body);

    const { accessToken, refreshToken } = data;
    res.cookie(AUTH_COOKIE, { accessToken, refreshToken }, { httpOnly: true });

    return res.status(HttpStatus.OK).json(data);
  }
}
