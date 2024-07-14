import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  publishedAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  authorId: string;
}

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDateString()
  publishedAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  authorId: string;
}
