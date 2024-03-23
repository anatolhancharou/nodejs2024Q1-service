import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

export enum EntitiesType {
  Tracks = 'tracks',
  Artists = 'artists',
  Albums = 'albums',
}

@Injectable()
export class FavoritesService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    const favoritesEntries = Object.entries(this.database.favorites) as [
      EntitiesType,
      string[],
    ][];

    const allFavorites = favoritesEntries.reduce((acc, [key, ids]) => {
      acc[key] = ids.map((id) => {
        const entities = this.database[key];
        return entities.find((entity) => entity.id === id);
      });

      return acc;
    }, {});

    return allFavorites;
  }

  async addEntityToFavorites(entitiesType: EntitiesType, id: string) {
    const entityIndex = this.database[entitiesType].findIndex(
      (entity) => entity.id === id,
    );

    if (entityIndex === -1) {
      throw new UnprocessableEntityException();
    }

    const isEntityFavorite = this.database.favorites[entitiesType].includes(id);

    if (!isEntityFavorite) {
      this.database.favorites[entitiesType].push(id);

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
    const entityIdIndex = this.database.favorites[entitiesType].findIndex(
      (entityId) => entityId === id,
    );

    if (entityIdIndex !== -1) {
      this.database.favorites[entitiesType].splice(entityIdIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
