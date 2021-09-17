import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { Config } from '@lets-choose/api/config';
import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ApiCommonServicesModule,
    ApiUserDataAccessModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        secret: configService.get('jwt.accessSecret', { infer: true }),
        signOptions: { expiresIn: '60s' }, // TODO refactor
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class ApiAuthFeatureModule {}
