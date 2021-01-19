import {
  AuthTokenDto,
  AuthRegisterDto,
  AuthLoginDto,
  AuthForgotPasswordDto,
} from '@lets-choose/common';

export interface IAuthService {
  registerUser({ email, username, password }: AuthRegisterDto): Promise<void>;
  loginUser({ login, password }: AuthLoginDto): Promise<AuthTokenDto>;
  loginUserOAuth(code: string): Promise<AuthTokenDto>;
  requestPasswordReset({ email }: AuthForgotPasswordDto): Promise<void>;
  resetUsersPassword(token: string, password: string): Promise<void>;
  refreshToken(token: string): Promise<AuthTokenDto>;
  confirmEmail(confirmEmailToken: string): Promise<void>;
}
