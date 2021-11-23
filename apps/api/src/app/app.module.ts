import { ApiHealthFeatureModule } from '@lets-choose/api-health-feature';
import { ApiAuthFeatureModule } from '@lets-choose/api/auth/feature';
import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { ApiConfigModule } from '@lets-choose/api/config';
import { ApiContestFeatureModule } from '@lets-choose/api/contest/feature';
import { ApiGameFeatureModule } from '@lets-choose/api/game/feature';
import { ApiMongooseModule } from '@lets-choose/api/mongoose';
import { ApiUserFeatureModule } from '@lets-choose/api/user/feature';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ApiConfigModule.register({}),
    ApiMongooseModule,
    ApiCommonServicesModule,
    ApiAuthFeatureModule,
    ApiUserFeatureModule,
    ApiContestFeatureModule,
    ApiGameFeatureModule,
    ApiHealthFeatureModule,
  ],
})
export class AppModule {}
