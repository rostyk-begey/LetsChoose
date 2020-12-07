import { User } from '../modules/user/user.schema';

export interface RegisterUserData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  registerUser({ email, username, password }: RegisterUserData): Promise<void>;
  loginUser(login: string, password: string): Promise<LoginData>;
  requestPasswordReset(email: string): Promise<void>;
  resetUsersPassword(token: string, password: string): Promise<User>;
  refreshToken(token: string): Promise<LoginData>;
  confirmEmail(confirmEmailToken: string): Promise<void>;
}
