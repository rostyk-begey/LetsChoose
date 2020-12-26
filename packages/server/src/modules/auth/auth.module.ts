import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtConfig } from '../../config';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
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
