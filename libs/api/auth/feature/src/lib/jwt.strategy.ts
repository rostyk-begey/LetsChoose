import {
  AuthTokenPayload,
  IJwtService,
  IUserRepository,
} from '@lets-choose/api/abstract';
import { JwtService } from '@lets-choose/api/common/services';
import { Config } from '@lets-choose/api/config';

import { UserRepository } from '@lets-choose/api/user/data-access';
import { UserPublicDto } from '@lets-choose/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

  public async validate({ userId }: AuthTokenPayload): Promise<UserPublicDto> {
    return await this.userRepository.findById(userId);
  }
}
