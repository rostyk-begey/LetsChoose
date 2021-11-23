import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.entity';
import { GameRepository } from './game.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [GameRepository],
  exports: [GameRepository],
})
export class ApiGameDataAccessModule {}
