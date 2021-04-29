import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { Game, GameSchema } from './game.entity';
import { ContestModule } from '../contest/contest.module';

@Module({
  imports: [
    forwardRef(() => ContestModule),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository],
  exports: [GameRepository],
})
export class GameModule {}
