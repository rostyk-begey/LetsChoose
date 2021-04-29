import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { GameModule } from '../game/game.module';
import { UserModule } from '../user/user.module';
import { ContestService } from './contest.service';
import { ContestRepository } from './contest.repository';
import { ContestItemRepository } from './contest-item.repository';
import { Contest, ContestSchema } from './contest.entity';
import { ContestItem, ContestItemSchema } from './contest-item.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ContestController } from './contest.controller';

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
