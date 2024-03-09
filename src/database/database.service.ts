import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  tracks: Track[] = [];
}
