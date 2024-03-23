import { Injectable } from '@nestjs/common';
import { Track } from 'src/tracks/entities/track.entity';
import { Favorites } from 'src/favorites/interface/favorites.interface';

@Injectable()
export class DatabaseService {
  tracks: Track[] = [];
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
