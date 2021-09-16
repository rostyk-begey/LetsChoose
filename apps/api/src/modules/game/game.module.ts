import { ApiContestDataAccessModule } from '@lets-choose/api/contest/data-access';
import { Module } from '@nestjs/common';

import { GameController } from '@modules/game/game.controller';
import { GameService } from '@modules/game/game.service';
import { ApiGameDataAccessModule } from '@lets-choose/api/game/data-access';

@Module({
  imports: [ApiContestDataAccessModule, ApiGameDataAccessModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [],
})
export class GameModule {}
