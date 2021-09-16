export interface IPasswordHashService {
  hash(password: string, salt: number | string): Promise<string>;
  compare(hash1: string, hash2: string): Promise<boolean>;
}
