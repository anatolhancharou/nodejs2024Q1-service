import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const trackSelect = {
  id: true,
  name: true,
  artistId: true,
  albumId: true,
  duration: true,
};

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    try {
      return await this.prisma.track.create({
        data: createTrackDto,
        select: trackSelect,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.track.findMany({ select: trackSelect });
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      select: trackSelect,
    });

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
        select: trackSelect,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }
}
