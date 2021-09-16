import { ApiContestDataAccessModule } from '@lets-choose/api/contest/data-access';
import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { GameModule } from '@modules/game/game.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { ContestService } from '@modules/contest/contest.service';
import { ContestController } from '@modules/contest/contest.controller';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      dest: './uploads',
    }),
    forwardRef(() => GameModule),
    ApiUserDataAccessModule,
    ApiContestDataAccessModule,
  ],
  providers: [ContestService],
  exports: [ContestService],
  controllers: [ContestController],
})
export class ContestModule {}
