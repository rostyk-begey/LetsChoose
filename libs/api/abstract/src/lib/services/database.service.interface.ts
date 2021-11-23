import { Connection } from 'mongoose';

export interface IDatabaseService {
  getConnection(): Connection;
}
