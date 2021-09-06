import { DatabaseService } from '@modules/common/database/database.service';

export enum TYPES {
  AuthService = 'AuthService',
  UserService = 'UserService',
  JwtService = 'JwtService',
  GameService = 'GameService',
  EmailService = 'EmailService',
  ContestService = 'ContestService',
  CloudinaryService = 'CloudinaryService',
  PasswordHashService = 'PasswordHashService',
  UserRepository = 'UserRepository',
  ContestRepository = 'ContestRepository',
  GameRepository = 'GameRepository',
  ContestItemRepository = 'ContestItemRepository',
  AuthMiddleware = 'AuthMiddleware',
  DatabaseService = 'DatabaseService',
  IsAuthorMiddleware = 'IsAuthorMiddleware',
  AuthController = 'AuthController',
  UserController = 'UserController',
  ContestController = 'ContestController',
  GameController = 'GameController',
}
