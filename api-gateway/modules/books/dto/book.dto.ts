import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  publication_year: number;

  @IsString()
  @IsOptional()
  file_url?: string;
}

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  publication_year?: number;

  @IsString()
  @IsOptional()
  file_url?: string;
}
