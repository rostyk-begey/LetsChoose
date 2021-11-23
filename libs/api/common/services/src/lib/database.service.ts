import { IDatabaseService } from '@lets-choose/api/abstract';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  public getConnection(): Connection {
    return this.connection;
  }
}
