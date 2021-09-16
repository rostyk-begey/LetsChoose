import { ApiContestDataAccessModule } from '@lets-choose/api/contest/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameController } from '@modules/game/game.controller';
import { GameService } from '@modules/game/game.service';
import { GameRepository } from '@modules/game/game.repository';
import { Game, GameSchema } from '@modules/game/game.entity';

@Module({
  imports: [
    ApiContestDataAccessModule,
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository],
  exports: [GameRepository],
})
export class GameModule {}
