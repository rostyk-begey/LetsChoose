import { ApiCloudinaryModule } from '@lets-choose/api/cloudinary';
import { ApiContestDataAccessModule } from '@lets-choose/api/contest/data-access';
import { ApiGameDataAccessModule } from '@lets-choose/api/game/data-access';
import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ContestService } from '@modules/contest/contest.service';
import { ContestController } from '@modules/contest/contest.controller';

@Module({
  imports: [
    ApiCloudinaryModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ApiGameDataAccessModule,
    ApiUserDataAccessModule,
    ApiContestDataAccessModule,
  ],
  providers: [ContestService],
  exports: [ContestService],
  controllers: [ContestController],
})
export class ContestModule {}
