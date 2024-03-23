import { Injectable } from '@nestjs/common';
import { Favorites } from 'src/favorites/interface/favorites.interface';

@Injectable()
export class DatabaseService {
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
