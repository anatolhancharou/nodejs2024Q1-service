import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategies/local-strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refresh-token.strategy';

@Module({
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
    }),
  ],
})
export class AuthModule {}
