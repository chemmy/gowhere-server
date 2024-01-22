import { IsDateString, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  search_location: string;

  @IsDateString()
  search_timestamp: number;
}
