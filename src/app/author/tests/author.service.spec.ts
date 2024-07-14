import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { Author } from '~/schemas/author.schema';
import { AuthorService } from '~/app/author/author.service';
import { CreateAuthorDto } from '~/app/author/author.dto';
import { Entity } from '~/types';

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
});
