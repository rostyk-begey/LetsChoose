import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { IPasswordHashService } from '../../../../abstract/src/lib/password.service.interface';

@Injectable()
export class PasswordHashService implements IPasswordHashService {
  public hash(password: string, salt: number | string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public compare(hash1: string, hash2: string): Promise<boolean> {
    return bcrypt.compare(hash1, hash2);
  }
}
