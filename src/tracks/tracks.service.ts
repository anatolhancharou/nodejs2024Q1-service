import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TracksService {
  constructor(private readonly database: DatabaseService) {}

  async create(createTrackDto: CreateTrackDto) {
    const { albumId, artistId, duration, name } = createTrackDto;

    const track = new Track({
      name,
      artistId,
      albumId,
      duration,
    });

    this.database.tracks.push(track);
    return track;
  }

  async findAll() {
    return this.database.tracks;
  }

  async findOne(id: string) {
    const track = this.database.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, artistId, albumId, duration } = updateTrackDto;
    const track = await this.findOne(id);

    Object.assign(track, { name, artistId, albumId, duration });
    return track;
  }

  async remove(id: string) {
    const trackIndex = this.database.tracks.findIndex(
      (track) => track.id === id,
    );

    if (trackIndex !== -1) {
      const favoriteTrackIndex = this.database.favorites.tracks.findIndex(
        (track) => track.id === id,
      );

      if (favoriteTrackIndex !== -1) {
        this.database.favorites.tracks.splice(favoriteTrackIndex, 1);
      }

      this.database.tracks.splice(trackIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
