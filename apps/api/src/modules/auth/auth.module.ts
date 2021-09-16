import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtConfig } from '@src/config';
import { CommonModule } from '@modules/common/common.module';
import { JwtStrategy } from '@modules/auth/jwt.strategy';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';

@Module({
  imports: [
    CommonModule,
    ApiUserDataAccessModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtConfig>('jwt').accessSecret,
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
