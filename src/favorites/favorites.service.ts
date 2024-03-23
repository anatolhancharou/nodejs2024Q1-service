import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { artistSelect } from 'src/artists/artists.service';
import { albumSelect } from 'src/albums/albums.service';
import { trackSelect } from 'src/tracks/tracks.service';

export enum EntitiesType {
  Tracks = 'tracks',
  Artists = 'artists',
  Albums = 'albums',
}

@Injectable()
export class FavoritesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      await this.prisma.favorites.create({ data: {} });
    }
  }

  async findAll() {
    return this.prisma.favorites.findFirst({
      select: {
        albums: { select: albumSelect },
        artists: { select: artistSelect },
        tracks: { select: trackSelect },
      },
    });
  }

  async addEntityToFavorites(entitiesType: EntitiesType, id: string) {
    const favoritesId = (await this.prisma.favorites.findFirst()).id;

    try {
      await this.prisma.favorites.update({
        where: { id: favoritesId },
        data: { [entitiesType]: { connect: { id } } },
      });

      const entityName = `${entitiesType[0].toUpperCase()}${entitiesType.slice(
        1,
        -1,
      )}`;

      return {
        message: `${entityName} has been added to favorites`,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new UnprocessableEntityException();
      }

      throw error;
    }
  }

  async removeEntityFromFavorites(entitiesType: EntitiesType, id: string) {
    const favoritesId = (await this.prisma.favorites.findFirst()).id;

    try {
      await this.prisma.favorites.update({
        where: { id: favoritesId },
        data: { [entitiesType]: { disconnect: { id } } },
      });
    } catch {
      throw new NotFoundException();
    }
  }
}
