import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
}
