import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameController } from '@modules/game/game.controller';
import { GameService } from '@modules/game/game.service';
import { GameRepository } from '@modules/game/game.repository';
import { Game, GameSchema } from '@modules/game/game.entity';
import { ContestModule } from '@modules/contest/contest.module';

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
