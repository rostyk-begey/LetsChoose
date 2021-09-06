import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { IDatabaseService } from '@abstract/database.service.interface';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  public getConnection(): Connection {
    return this.connection;
  }
}
