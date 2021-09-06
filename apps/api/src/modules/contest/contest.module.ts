import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { GameModule } from '@modules/game/game.module';
import { UserModule } from '@modules/user/user.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { ContestService } from '@modules/contest/contest.service';
import { ContestRepository } from '@modules/contest/contest.repository';
import { ContestItemRepository } from '@modules/contest/contest-item.repository';
import { Contest, ContestSchema } from '@modules/contest/contest.entity';
import {
  ContestItem,
  ContestItemSchema,
} from '@modules/contest/contest-item.entity';
import { ContestController } from '@modules/contest/contest.controller';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      dest: './uploads',
    }),
    forwardRef(() => GameModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Contest.name, schema: ContestSchema }]),
    MongooseModule.forFeature([
      { name: ContestItem.name, schema: ContestItemSchema },
    ]),
  ],
  providers: [ContestService, ContestRepository, ContestItemRepository],
  exports: [ContestService, ContestRepository, ContestItemRepository],
  controllers: [ContestController],
})
export class ContestModule {}
