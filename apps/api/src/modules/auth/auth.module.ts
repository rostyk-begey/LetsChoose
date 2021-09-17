import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { Config } from '@lets-choose/api/config';
import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtConfig } from '@lets-choose/api/config';
import { JwtStrategy } from '@modules/auth/jwt.strategy';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';

@Module({
  imports: [
    ApiCommonServicesModule,
    ApiUserDataAccessModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        secret: configService.get('jwt.accessSecret', { infer: true }),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
