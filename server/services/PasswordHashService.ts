import bcrypt from 'bcryptjs';

export default class PasswordHashService {
  public hash(password: string, salt: number | string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public compare(hash1: string, hash2: string): Promise<boolean> {
    return bcrypt.compare(hash1, hash2);
  }
}
