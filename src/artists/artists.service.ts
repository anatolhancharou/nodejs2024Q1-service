import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export const artistSelect = {
  id: true,
  name: true,
  grammy: true,
};

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({
      data: createArtistDto,
      select: artistSelect,
    });
  }

  async findAll() {
    return this.prisma.artist.findMany({ select: artistSelect });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: artistSelect,
    });

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
        select: artistSelect,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }
}
