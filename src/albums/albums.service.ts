import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly database: DatabaseService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const album = new Album(createAlbumDto);
    this.database.albums.push(album);
    return album;
  }

  async findAll() {
    return this.database.albums;
  }

  async findOne(id: string) {
    const album = this.database.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);
    Object.assign(album, updateAlbumDto);
    return album;
  }

  async remove(id: string) {
    const albumIndex = this.database.albums.findIndex(
      (album) => album.id === id,
    );

    if (albumIndex !== -1) {
      this.database.tracks.forEach((track) => {
        if (track.albumId === id) {
          track.albumId = null;
        }
      });

      const favoriteAlbumIndex = this.database.favorites.albums.findIndex(
        (album) => album.id === id,
      );

      if (favoriteAlbumIndex !== -1) {
        this.database.favorites.albums.splice(favoriteAlbumIndex, 1);
      }

      this.database.albums.splice(albumIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
