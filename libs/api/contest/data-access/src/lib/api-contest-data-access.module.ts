import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContestItem, ContestItemSchema } from './contest-item.entity';
import { ContestItemRepository } from './contest-item.repository';
import { Contest, ContestSchema } from './contest.entity';
import { ContestRepository } from './contest.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contest.name, schema: ContestSchema }]),
    MongooseModule.forFeature([
      { name: ContestItem.name, schema: ContestItemSchema },
    ]),
  ],
  providers: [ContestRepository, ContestItemRepository],
  exports: [ContestRepository, ContestItemRepository],
})
export class ApiContestDataAccessModule {}
