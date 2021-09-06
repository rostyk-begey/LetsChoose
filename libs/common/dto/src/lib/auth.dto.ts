export class AuthLoginDto {
  login!: string;
  password!: string;
}

export type AuthGoogleLoginDto = { token: string };

export class AuthTokenDto {
  userId!: string;
  accessToken!: string;
  refreshToken!: string;
}

export class AuthRegisterDto {
  email!: string;
  username!: string;
  password!: string;
}

export class AuthForgotPasswordDto {
  email!: string;
}

export type RefreshTokenLocation = 'body' | 'cookies';

export class AuthResetPasswordDto {
  password!: string;
}
