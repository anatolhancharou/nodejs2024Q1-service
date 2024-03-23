import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const albumSelect = {
  id: true,
  name: true,
  year: true,
  artistId: true,
};

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    try {
      return await this.prisma.album.create({
        data: createAlbumDto,
        select: albumSelect,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.album.findMany({ select: albumSelect });
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      select: albumSelect,
    });

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
        select: albumSelect,
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
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }
}
