import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  handleRequest(err: unknown, user: any, info: unknown) {
    if (
      info instanceof JsonWebTokenError ||
      info instanceof TokenExpiredError
    ) {
      throw new ForbiddenException();
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
