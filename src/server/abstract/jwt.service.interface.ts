export interface BaseTokenPayload {
  userId: string;
}

export interface AuthTokenPayload extends BaseTokenPayload {
  passwordVersion: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtService {
  generateAuthTokenPair(userId: string, passwordVersion: number): TokenPair;
  generateAccessToken(payload: AuthTokenPayload): string;
  generateRefreshToken(payload: AuthTokenPayload): string;
  generateResetPasswordToken(userId: string): string;
  generateEmailToken(userId: string): string;
  verifyAccessToken(token: string): AuthTokenPayload;
  verifyRefreshToken(token: string): AuthTokenPayload;
  verifyEmailToken(token: string): BaseTokenPayload;
  verifyPasswordResetToken(token: string): BaseTokenPayload;
}
