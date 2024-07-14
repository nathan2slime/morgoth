import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  CreateAuthorDto,
  SearchAuthorDto,
  UpdateAuthorDto,
} from '~/app/author/author.dto';
import { AuthorService } from '~/app/author/author.service';
import { JwtAuthGuard } from '~/app/auth/auth.guard';
import { RoleGuard } from '~/app/auth/role.guard';
import { Roles } from '~/app/auth/auth.decorator';
import { Role } from '~/types/role.enum';

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Create new author',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  async create(@Body() body: CreateAuthorDto, @Res() res: Response) {
    const data = await this.authorService.create(body);

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a author',
  })
  async getById(@Param('id') id: string, @Res() res: Response) {
    const data = await this.authorService.getById(id);

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Delete('delete/:id')
  @ApiResponse({
    status: 201,
    description: 'Delete a author',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.authorService.delete(id);

    return res.status(HttpStatus.OK).send();
  }

  @Put('update/:id')
  @ApiResponse({
    status: 201,
    description: 'Update a author',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  async update(
    @Body() body: UpdateAuthorDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data = await this.authorService.update(id, body);

    return res.status(HttpStatus.OK).json(data);
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Author search',
  })
  async search(@Query() query: SearchAuthorDto, @Res() res: Response) {
    const data = await this.authorService.search(query);
    return res.status(HttpStatus.OK).json(data);
  }
}
