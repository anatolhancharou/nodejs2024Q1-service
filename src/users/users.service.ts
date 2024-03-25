import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const userSelect = {
  id: true,
  login: true,
  version: true,
  createdAt: true,
  updatedAt: true,
};

const getTransformedUser = (user: { createdAt: Date; updatedAt: Date }) => ({
  ...user,
  createdAt: user.createdAt.getTime(),
  updatedAt: user.updatedAt.getTime(),
});

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
      select: userSelect,
    });

    return getTransformedUser(user);
  }

  async findAll() {
    const allUsers = await this.prisma.user.findMany({ select: userSelect });
    return allUsers.map(getTransformedUser);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return getTransformedUser(user);
  }

  async update(id: string, updatePassword: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    if (user.password === updatePassword.oldPassword) {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          password: updatePassword.newPassword,
          version: user.version + 1,
        },
        select: userSelect,
      });

      return getTransformedUser(updatedUser);
    } else {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }
}
