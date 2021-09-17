import { ApiHealthModule } from '@lets-choose/api-health-feature';
import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { ApiConfigModule, Config } from '@lets-choose/api/config';
import { ApiUserFeatureModule } from '@lets-choose/api/user/feature';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { ContestModule } from '@modules/contest/contest.module';
import { AuthModule } from '@modules/auth/auth.module';
import { GameModule } from '@modules/game/game.module';

@Module({
  imports: [
    ApiConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => {
        const options: MongooseModuleOptions = {
          uri: configService.get('mongoUri', { infer: true }),
        };

        if (configService.get('environment', { infer: true }) === 'test') {
          options.retryAttempts = 0;
        }

        return options;
      },
      inject: [ConfigService],
    }),
    ApiCommonServicesModule,
    AuthModule,
    ApiUserFeatureModule,
    GameModule,
    ContestModule,
    ApiHealthModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
