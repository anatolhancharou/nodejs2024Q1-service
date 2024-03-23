import { Injectable } from '@nestjs/common';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Favorites } from 'src/favorites/interface/favorites.interface';

@Injectable()
export class DatabaseService {
  tracks: Track[] = [];
  albums: Album[] = [];
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
