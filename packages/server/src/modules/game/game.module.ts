import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { Game, GameSchema } from './game.schema';
import { ContestModule } from '../contest/contest.module';

@Module({
  imports: [
    ContestModule,
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class GameModule {}
