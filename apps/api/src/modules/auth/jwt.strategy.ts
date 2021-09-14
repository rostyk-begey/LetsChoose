import { JwtService } from '@modules/common/jwt/jwt.service';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfig } from '@src/config';
import { TYPES } from '@src/injectable.types';
import { User } from '../user/user.entity';
import { IUserRepository } from '@abstract/user.repository.interface';
import { AuthTokenPayload, IJwtService } from '@abstract/jwt.service.interface';
import { UserRepository } from '../user/user.repository';

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

  async validate({ userId }: AuthTokenPayload): Promise<User> {
    return await this.userRepository.findById(userId);
  }
}