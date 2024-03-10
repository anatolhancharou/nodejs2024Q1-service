import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.favorites;
  }

  async addTrackToFavorites(id: string) {
    const track = this.database.tracks.find((item) => item.id === id);

    if (!track) {
      throw new UnprocessableEntityException();
    }

    const isTrackFavorite = this.database.favorites.tracks.some(
      (track) => track.id === id,
    );

    if (!isTrackFavorite) {
      this.database.favorites.tracks.push(track);
      return { message: 'Track has been added to favorites' };
    }
  }

  async removeTrackFromFavorites(id: string) {
    const trackIndex = this.database.favorites.tracks.findIndex(
      (item) => item.id === id,
    );

    if (trackIndex !== -1) {
      this.database.favorites.tracks.splice(trackIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }

  async addAlbumToFavorites(id: string) {
    const album = this.database.albums.find((item) => item.id === id);

    if (!album) {
      throw new UnprocessableEntityException();
    }

    const isAlbumFavorite = this.database.favorites.albums.some(
      (album) => album.id === id,
    );

    if (!isAlbumFavorite) {
      this.database.favorites.albums.push(album);
      return { message: 'Album has been added to favorites' };
    }
  }

  async removeAlbumFromFavorites(id: string) {
    const albumIndex = this.database.favorites.albums.findIndex(
      (item) => item.id === id,
    );

    if (albumIndex !== -1) {
      this.database.favorites.albums.splice(albumIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }

  async addArtistToFavorites(id: string) {
    const artist = this.database.artists.find((item) => item.id === id);

    if (!artist) {
      throw new UnprocessableEntityException();
    }

    const isArtistFavorite = this.database.favorites.artists.some(
      (item) => item.id === id,
    );

    if (!isArtistFavorite) {
      this.database.favorites.artists.push(artist);
      return { message: 'Artist has been added to favorites' };
    }
  }

  async removeArtistFromFavorites(id: string) {
    const artistIndex = this.database.favorites.artists.findIndex(
      (item) => item.id === id,
    );

    if (artistIndex !== -1) {
      this.database.favorites.artists.splice(artistIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
