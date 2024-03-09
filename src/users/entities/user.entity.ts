import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../dto/create-user.dto';

export class User {
  readonly id: string;
  readonly login: string;

  @Exclude()
  password: string;
  version = 1;
  readonly createdAt: number;
  updatedAt: number;

  constructor(userData: CreateUserDto) {
    const timeStamp = Date.now();
    this.id = uuidv4();
    this.login = userData.login;
    this.password = userData.password;
    this.createdAt = timeStamp;
    this.updatedAt = timeStamp;
  }
}
