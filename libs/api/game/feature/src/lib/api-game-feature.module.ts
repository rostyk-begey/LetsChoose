import { ApiContestDataAccessModule } from '@lets-choose/api/contest/data-access';
import { ApiGameDataAccessModule } from '@lets-choose/api/game/data-access';
import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [ApiContestDataAccessModule, ApiGameDataAccessModule],
  controllers: [GameController],
  providers: [GameService],
})
export class ApiGameFeatureModule {}
