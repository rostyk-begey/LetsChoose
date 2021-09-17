import { UserDto } from '@lets-choose/common/dto';
import { JwtService } from '@lets-choose/api/common/services';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRepository } from '@lets-choose/api/user/data-access';
import {
  IUserRepository,
  AuthTokenPayload,
  IJwtService,
} from '@lets-choose/api/abstract';

const cookieExtractor = (req) => {
  if (req?.cookies) {
    return req.cookies['accessToken'];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,

    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(JwtService)
    private readonly jwtService: IJwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  public async validate({ userId }: AuthTokenPayload): Promise<UserDto> {
    return await this.userRepository.findById(userId);
  }
}
