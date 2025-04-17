import { IsUUID, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateReadingProgressDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsUUID()
  user_id: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsUUID()
  book_id: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  current_page: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(0)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Max(100)
  percentage_read: number;
}

export class UpdateReadingProgressDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  current_page: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(0)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Max(100)
  percentage_read: number;
}
