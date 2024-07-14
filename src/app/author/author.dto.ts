import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { SortOrder } from '~/types/filter.enum';

export class UpdateAuthorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  biography: string;
}

export class CreateAuthorDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  biography: string;
}

export class QuerySearchDto {
  @ApiProperty({ required: false })
  @Transform(params => {
    if (params.value) {
      if (params.value.trim().length == 0) return undefined;
    }

    return params.value;
  })
  query: string;

  @ApiProperty({ default: 1, required: false })
  @Transform(params => parseInt(params.value))
  @IsOptional()
  @Min(1)
  page: number = 1;

  @ApiProperty({ enum: SortOrder, default: SortOrder.DESC, required: false })
  sortOrder: SortOrder;

  @ApiProperty({ required: false })
  @IsOptional()
  sortField: string;

  @ApiProperty({ default: 12, required: false })
  @Transform(params => parseInt(params.value))
  @IsOptional()
  @Min(1)
  perPage: number = 12;
}
