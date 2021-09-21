import { IGameRepository } from '@lets-choose/api/abstract';

import { CreateGameDto, GameDto } from '@lets-choose/common/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  public async aggregate(aggregations?: any[]): Promise<GameDto[]> {
    const res = await this.gameModel
      .aggregate<GameDocument>(aggregations)
      .exec();

    return res.map((doc) => doc.toObject());
  }

  public async findById(gameId: string): Promise<GameDto> {
    const game = await this.gameModel
      .findById(new Types.ObjectId(gameId))
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
  ): Promise<GameDto> {
    const game = await this.gameModel.findByIdAndUpdate(
      new Types.ObjectId(gameId),
      { $set: data },
    );
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game.toObject();
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const game = await this.gameModel.findByIdAndRemove(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game.toObject();
  }

  public async deleteGames(contestId: string): Promise<void> {
    await this.gameModel.deleteMany({ contestId });
  }

  public async createGame(data: CreateGameDto): Promise<GameDto> {
    const gameId = new Types.ObjectId().toString();
    const game = new this.gameModel({
      id: gameId,
      _id: gameId,
      ...data,
    });
    await game.save();
    return game.toObject();
  }
}
