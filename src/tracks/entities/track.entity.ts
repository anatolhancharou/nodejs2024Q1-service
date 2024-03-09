import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from '../dto/create-track.dto';

export class Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(trackData: CreateTrackDto) {
    this.id = uuidv4();
    this.name = trackData.name;
    this.artistId = trackData.artistId;
    this.albumId = trackData.albumId;
    this.duration = trackData.duration;
  }
}
