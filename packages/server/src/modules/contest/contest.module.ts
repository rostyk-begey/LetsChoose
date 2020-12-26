import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContestService } from './contest.service';
import { ContestRepository } from './contest.repository';
import { ContestItemRepository } from './contest-item.repository';
import { Contest, ContestSchema } from './contest.schema';
import { ContestItem, ContestItemSchema } from './contest-item.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ContestController } from './contest.controller';

@Module({
  imports: [
    CloudinaryModule,
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
