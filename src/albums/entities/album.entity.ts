import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from '../dto/create-album.dto';

export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor({ name, year, artistId }: CreateAlbumDto) {
    this.id = uuidv4();
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
