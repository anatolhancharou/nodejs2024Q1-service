import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private validateLoginDto(login: string, password: string) {
    const errorMessages = [];

    if (!login) errorMessages.push('login should not be empty');
    if (typeof login !== 'string') errorMessages.push('login must be a string');
    if (!password) errorMessages.push('password should not be empty');
    if (typeof password !== 'string')
      errorMessages.push('password must be a string');

    if (errorMessages.length) throw new BadRequestException(errorMessages);
  }

  async validateUser(login: string, password: string) {
    this.validateLoginDto(login, password);

    const user = await this.userService.findOneByLogin(login);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { login: user.login, userId: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async refreshToken(user: { login: string; userId: string }) {
    const payload = { login: user.login, userId: user.userId };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }
}