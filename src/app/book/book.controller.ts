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

import { CreateBookDto, UpdateBookDto } from '~/app/book/book.dto';
import { BookService } from '~/app/book/book.service';
import { QuerySearchDto } from '~/app/author/author.dto';
import { JwtAuthGuard } from '~/app/auth/auth.guard';
import { RoleGuard } from '~/app/auth/role.guard';
import { Roles } from '~/app/auth/auth.decorator';
import { Role } from '~/types/role.enum';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Create new book',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  async create(@Body() body: CreateBookDto, @Res() res: Response) {
    const data = await this.bookService.create(body);

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get('show/:id')
  @ApiResponse({
    status: 200,
    description: 'Get a book',
  })
  async getById(@Param('id') id: string, @Res() res: Response) {
    const data = await this.bookService.getById(id);

    return res.status(HttpStatus.OK).json(data);
  }

  @Delete('delete/:id')
  @ApiResponse({
    status: 200,
    description: 'Delete a book',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.bookService.delete(id);

    return res.status(HttpStatus.OK).send();
  }

  @Put('update/:id')
  @ApiResponse({
    status: 201,
    description: 'Update a book',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.ADMIN])
  async update(
    @Body() body: UpdateBookDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data = await this.bookService.update(id, body);

    return res.status(HttpStatus.OK).json(data);
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Book search',
  })
  async search(@Query() query: QuerySearchDto, @Res() res: Response) {
    const data = await this.bookService.search(query);

    return res.status(HttpStatus.OK).json(data);
  }
}
