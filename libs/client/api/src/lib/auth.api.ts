import { ROUTES } from '@lets-choose/client/utils';
import {
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthTokenDto,
  HttpResponseMessageDto,
  UpdateUserPasswordDto,
  UserPublicDto,
} from '@lets-choose/common/dto';

import { Api } from './api';

// TODO refactor
export interface ResetPasswordData {
  token: string;
  data: {
    password: string;
  };
}

const {
  LOGIN,
  LOGIN_GOOGLE,
  LOGOUT,
  REGISTER,
  CONFIRM_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  UPDATE_PASSWORD,
} = ROUTES.API.AUTH;

export class AuthApi extends Api {
  login = (data: AuthLoginDto) => {
    return this.api.post<AuthTokenDto>(LOGIN, data);
  };

  loginGoogle = (data: AuthGoogleLoginDto) => {
    return this.api.post<AuthTokenDto>(LOGIN_GOOGLE, data);
  };

  logout = () => {
    return this.api.post<HttpResponseMessageDto>(LOGOUT, {});
  };

  register = (data: AuthRegisterDto) => {
    return this.api.post<HttpResponseMessageDto>(REGISTER, data);
  };

  confirmEmail = (token: string) => {
    return this.api.post<HttpResponseMessageDto>(`${CONFIRM_EMAIL}/${token}`);
  };

  forgotPassword = (data: AuthForgotPasswordDto) => {
    return this.api.post<HttpResponseMessageDto>(FORGOT_PASSWORD, data);
  };

  resetPassword = ({ token, data }: ResetPasswordData) => {
    return this.api.post<HttpResponseMessageDto>(
      `${RESET_PASSWORD}/${token}`,
      data,
    );
  };

  updatePassword = (data: UpdateUserPasswordDto) => {
    return this.api.post<UserPublicDto>(UPDATE_PASSWORD, data);
  };
}
