import {
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthTokenDto,
  UpdateUserPasswordDto,
} from '@lets-choose/common/dto';

export interface IAuthService {
  registerUser({ email, username, password }: AuthRegisterDto): Promise<void>;
  loginUser({ login, password }: AuthLoginDto): Promise<AuthTokenDto>;
  loginUserOAuth(dto: AuthGoogleLoginDto): Promise<AuthTokenDto>;
  requestPasswordReset({ email }: AuthForgotPasswordDto): Promise<void>;
  resetUsersPassword(token: string, password: string): Promise<void>;
  updateUsersPassword(
    userId: string,
    dto: UpdateUserPasswordDto,
  ): Promise<AuthTokenDto>;
  refreshToken(token: string): Promise<AuthTokenDto>;
  confirmEmail(confirmEmailToken: string): Promise<void>;
}
