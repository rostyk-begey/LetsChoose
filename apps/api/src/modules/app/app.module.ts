import { ApiHealthModule } from '@lets-choose/api-health-feature';
import { ApiAuthFeatureModule } from '@lets-choose/api/auth/feature';
import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { ApiConfigModule, Config } from '@lets-choose/api/config';
import { ApiContestFeatureModule } from '@lets-choose/api/contest/feature';
import { ApiGameFeatureModule } from '@lets-choose/api/game/feature';
import { ApiUserFeatureModule } from '@lets-choose/api/user/feature';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

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
    ApiAuthFeatureModule,
    ApiUserFeatureModule,
    ApiContestFeatureModule,
    ApiGameFeatureModule,
    ApiHealthModule,
  ],
})
export class AppModule {}
