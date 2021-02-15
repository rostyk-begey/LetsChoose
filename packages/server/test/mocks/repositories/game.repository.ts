import { CreateGameDto } from '@lets-choose/common';

import { IGameRepository } from '../../../src/abstract/game.repository.interface';
import { Game } from '../../../src/modules/game/game.schema';
import games from './data/games';
import ContestItemRepository from './contest-item.repository';

export let mockGames = [...games];

const GameRepository: IGameRepository = {
  async countDocuments(): Promise<number> {
    return mockGames.length;
  },

  async aggregate(aggregations?: any[]): Promise<Game[]> {
    return mockGames;
  },

  async findById(gameId: string): Promise<Game> {
    const game = mockGames.find(({ id }) => id === gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    game.pair = await Promise.all(
      game.pair.map((id) => ContestItemRepository.findById(id.toString())),
    );
    return game;
  },

  async findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game> {
    mockGames = mockGames.map(({ id, ...game }) => {
      if (id === gameId) {
        return { id, ...game, ...data };
      }
      return { id, ...game };
    });
    return this.findById(gameId);
  },

  async deleteGame(gameId: string): Promise<Game> {
    const game = await this.findById(gameId);
    mockGames = mockGames.filter(({ id }) => id !== gameId);
    return game;
  },

  async createGame(data: CreateGameDto): Promise<Game> {
    const game = {
      id: data._id,
      ...data,
    };
    mockGames.push(game as Game);
    return this.findById(game.id);
  },
};

GameRepository.countDocuments = jest.fn(GameRepository.countDocuments);
GameRepository.aggregate = jest.fn(GameRepository.aggregate);
GameRepository.findById = jest.fn(GameRepository.findById);
GameRepository.findByIdAndUpdate = jest.fn(GameRepository.findByIdAndUpdate);
GameRepository.deleteGame = jest.fn(GameRepository.deleteGame);
GameRepository.createGame = jest.fn(GameRepository.createGame);

export default GameRepository;
