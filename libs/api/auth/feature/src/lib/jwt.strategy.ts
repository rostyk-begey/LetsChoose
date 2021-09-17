import { Config } from '@lets-choose/api/config';
import { UserDto } from '@lets-choose/common/dto';
import { JwtService } from '@lets-choose/api/common/services';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserRepository } from '@lets-choose/api/user/data-access';
import {
  IUserRepository,
  AuthTokenPayload,
  IJwtService,
} from '@lets-choose/api/abstract';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<Config>,

    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(JwtService)
    private readonly jwtService: IJwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.extractAuthTokenFromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret', { infer: true }),
    });
  }

  private static extractAuthTokenFromCookies(req: Request): string | null {
    return req?.cookies ? req.cookies['accessToken'] : null;
  }

  public async validate({ userId }: AuthTokenPayload): Promise<UserDto> {
    return await this.userRepository.findById(userId);
  }
}