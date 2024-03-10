import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsUUID('4')
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
}
