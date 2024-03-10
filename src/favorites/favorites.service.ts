import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

export enum EntitiesType {
  Tracks = 'tracks',
  Artists = 'artists',
  Albums = 'albums',
}

@Injectable()
export class FavoritesService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.favorites;
  }

  async addEntityToFavorites(entitiesType: EntitiesType, id: string) {
    const entities: Array<Track | Album | Artist> = this.database[entitiesType];
    const entity = entities.find((item) => item.id === id);

    if (!entity) {
      throw new UnprocessableEntityException();
    }

    const isEntityFavorite = this.database.favorites[entitiesType].some(
      (entity: Track | Album | Artist) => entity.id === id,
    );

    if (!isEntityFavorite) {
      const favoriteEntities: Array<Track | Album | Artist> =
        this.database.favorites[entitiesType];
      favoriteEntities.push(entity);

      const entityName = `${entitiesType[0].toUpperCase()}${entitiesType.slice(
        1,
        -1,
      )}`;

      return {
        message: `${entityName} has been added to favorites`,
      };
    }
  }

  async removeEntityFromFavorites(entitiesType: EntitiesType, id: string) {
    const entityIndex = this.database.favorites[entitiesType].findIndex(
      (item: Track | Album | Artist) => item.id === id,
    );

    if (entityIndex !== -1) {
      this.database.favorites[entitiesType].splice(entityIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
