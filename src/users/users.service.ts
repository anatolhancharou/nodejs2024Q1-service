import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    this.database.users.push(user);
    return user;
  }

  async findAll() {
    return this.database.users;
  }

  async findOne(id: string) {
    const user = this.database.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, updatePassword: UpdatePasswordDto) {
    const user = await this.findOne(id);

    if (user.password === updatePassword.oldPassword) {
      user.password = updatePassword.newPassword;
      user.updatedAt = Date.now();
      user.version += 1;
    } else {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async remove(id: string) {
    const userIndex = this.database.users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      this.database.users.splice(userIndex, 1);
    } else {
      throw new NotFoundException();
    }
  }
}
