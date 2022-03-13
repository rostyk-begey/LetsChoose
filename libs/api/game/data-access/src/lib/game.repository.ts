import {
  AbstractMongooseRepository,
  IGameRepository,
} from '@lets-choose/api/abstract';
import { CreateGameDto, GameDto } from '@lets-choose/common/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Game, GameDocument } from './game.entity';

@Injectable()
export class GameRepository
  extends AbstractMongooseRepository<
    GameDto,
    CreateGameDto & { _id: any },
    GameDto,
    GameDocument
  >
  implements IGameRepository
{
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
  ) {
    super(gameModel);
  }

  public async findById(gameId: string): Promise<GameDto> {
    const game = await this.gameModel
      .findById(new Types.ObjectId(gameId))
      .populate('items')
      .populate('pair');

    return this.checkIfExistsAndTransformToDocument(game);
  }

  public async deleteGames(contestId: string): Promise<void> {
    await this.gameModel.deleteMany({ contestId });
  }
}
