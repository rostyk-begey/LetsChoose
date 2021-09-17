import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateGameDto } from '@lets-choose/common/dto';
import { IGameRepository } from '@lets-choose/api/abstract';
import { Game, GameDocument } from './game.entity';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
  ) {}

  public async countDocuments(): Promise<number> {
    const res = await this.gameModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<Game[]> {
    return this.gameModel.aggregate(aggregations).exec();
  }

  public async findById(gameId: string): Promise<Game> {
    const game = await this.gameModel
      .findById(gameId)
      .populate('items')
      .populate('pair');

    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game.toObject();
  }

  public async findByIdAndUpdate(
    gameId: string,
    data: Partial<Game>,
  ): Promise<Game> {
    const game = await this.gameModel.findByIdAndUpdate(gameId, { $set: data });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const game = await this.gameModel.findByIdAndRemove(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  public async deleteGames(contestId: string): Promise<void> {
    await this.gameModel.deleteMany({ contestId });
  }

  public async createGame(data: CreateGameDto): Promise<Game> {
    const game = new this.gameModel(data);
    await game.save();
    return game;
  }
}
