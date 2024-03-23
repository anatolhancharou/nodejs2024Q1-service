import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID('4')
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;

  @IsUUID('4')
  @ValidateIf((_, value) => value !== null)
  albumId: string | null;

  @IsInt()
  duration: number;
}
