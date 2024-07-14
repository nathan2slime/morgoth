import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { Author } from '~/schemas/author.schema';
import { AuthorService } from '~/app/author/author.service';
import {
  CreateAuthorDto,
  QuerySearchDto,
  UpdateAuthorDto,
} from '~/app/author/author.dto';
import { Entity } from '~/types';

import * as pagination from '~/utils/funcs/pagination';

describe('AuthorService', () => {
  let authorModel: Model<Author>;
  let authorService: AuthorService;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        AuthorService,
        {
          provide: getModelToken(Author.name),
          useValue: Model,
        },
      ],
    }).compile();

    authorService = app.get<AuthorService>(AuthorService);
    authorModel = app.get<Model<Author>>(getModelToken(Author.name));
  });

  describe('create', () => {
    const payload: CreateAuthorDto = {
      biography: expect.anything(),
      name: expect.anything(),
      birthDate: expect.anything(),
    };

    const author = {} as Entity<Author>[];
    it('should return author created', async () => {
      jest.spyOn(authorModel, 'create').mockResolvedValue(author);

      const data = await authorService.create(payload);

      expect(data).toBe(author);
      expect(authorModel.create).toHaveBeenCalledWith(payload);
    });
  });

  describe('delete', () => {
    const authorId = expect.anything();

    it('must delete an author by id', async () => {
      jest
        .spyOn(authorModel, 'findByIdAndDelete')
        .mockResolvedValue(expect.anything());

      await authorService.delete(authorId);

      expect(authorModel.findByIdAndDelete).toHaveBeenCalledWith(authorId);
    });
  });

  describe('search', () => {
    const payload = {
      items: expect.anything(),
      total: expect.anything(),
      pages: expect.anything(),
      perPage: expect.anything(),
      page: expect.anything(),
    };
    const args: QuerySearchDto = {
      page: expect.anything(),
      perPage: expect.anything(),
      query: expect.anything(),
      sortField: expect.anything(),
      sortOrder: expect.anything(),
    };

    it('must search for an author', async () => {
      jest.spyOn(pagination, 'paginate').mockResolvedValue(payload);

      const res = await authorService.search(args);

      expect(res).toBe(payload);
    });
  });

  describe('update', () => {
    const author = {} as Entity<Author>[];
    const payload: UpdateAuthorDto = {
      biography: expect.anything(),
      name: expect.anything(),
      birthDate: expect.anything(),
    };

    const authorId = expect.anything();

    it('must update author and return it updated', async () => {
      jest.spyOn(authorModel, 'findByIdAndUpdate').mockResolvedValue(author);

      const data = await authorService.update(authorId, payload);

      expect(data).toBe(author);
      expect(authorModel.findByIdAndUpdate).toHaveBeenCalledWith(
        authorId,
        payload,
        { new: true },
      );
    });
  });
});
