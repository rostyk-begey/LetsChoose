import { Game } from '../../../models/Game';
import { AppError } from '../../../usecases/error';
import {
  CreateGameData,
  IGameRepository,
} from '../../../repositories/GameRepository';
import games from './data/games';
import ContestItemRepository from './ContestItemRepository';

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
      throw new AppError('Game not found', 404);
    }
    // @ts-ignore
    game.pair = await Promise.all(
      game.pair.map((id) =>
        // @ts-ignore
        ContestItemRepository.findById(id.toString()),
      ),
    );
    return game;
  },

  async findByIdAndUpdate(gameId: string, data: Partial<Game>): Promise<Game> {
    mockGames = mockGames.map(({ id, ...game }) => {
      if (id === gameId) {
        // @ts-ignore
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

  async createGame(data: CreateGameData): Promise<Game> {
    console.log({ create: data.pair });
    const game = {
      id: data._id,
      ...data,
      // @ts-ignore
      // pair: data.pair.map(({ id }) => id),
    };
    mockGames.push(game);
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
