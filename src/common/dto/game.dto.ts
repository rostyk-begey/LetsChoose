import { Game } from '../../server/modules/game/game.schema';

export type CreateGameDto = Omit<Game, 'id'>;
