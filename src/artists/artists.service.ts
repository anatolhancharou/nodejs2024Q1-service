import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from 'src/database/database.service';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(private readonly database: DatabaseService) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = new Artist(createArtistDto);
    this.database.artists.push(artist);
    return artist;
  }

  async findAll() {
    return this.database.artists;
  }

  async findOne(id: string) {
    const artist = this.database.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  async remove(id: string) {
    const artistIndex = this.database.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (artistIndex !== -1) {
      const artistId = this.database.artists[artistIndex].id;

      this.database.tracks.forEach((track) => {
        if (track.artistId === artistId) {
          track.artistId = null;
        }
      });

      this.database.artists.splice(artistIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
