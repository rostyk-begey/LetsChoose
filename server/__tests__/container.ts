import { Container, interfaces } from 'inversify';
import 'reflect-metadata';

import JwtService from './__mocks__/services/JwtService';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import GameService from '../services/GameService';
import EmailService from './__mocks__/services/EmailService';
import ContestService from '../services/ContestService';
import CloudinaryService from './__mocks__/services/CloudinaryService';
import PasswordHashService from './__mocks__/services/PasswordHashService';

import GameRepository from './__mocks__/repositories/GameRepository';
import UserRepository from './__mocks__/repositories/UserRepository';
import ContestRepository from './__mocks__/repositories/ContestRepository';
import ContestItemRepository from './__mocks__/repositories/ContestItemRepository';

import UserController from '../controllers/user/UserController';
import GameController from '../controllers/game/GameController';
import AuthController from '../controllers/auth/AuthController';
import ContestController from '../controllers/contest/ContestController';

import AuthMiddleware from '../middleware/AuthMiddleware';
import IsAuthorMiddleware from '../middleware/IsAuthorMiddleware';
import { TYPES } from '../inversify.types';

const container: interfaces.Container = new Container();

// Services
container.bind(TYPES.AuthService).to(AuthService);
container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.CloudinaryService).toConstantValue(CloudinaryService);
container.bind(TYPES.JwtService).toConstantValue(JwtService);
container.bind(TYPES.GameService).to(GameService);
container.bind(TYPES.EmailService).toConstantValue(EmailService);
container.bind(TYPES.ContestService).to(ContestService);
container.bind(TYPES.PasswordHashService).toConstantValue(PasswordHashService);

// Repositories
container.bind(TYPES.UserRepository).toConstantValue(UserRepository);
container.bind(TYPES.ContestRepository).toConstantValue(ContestRepository);
container.bind(TYPES.GameRepository).toConstantValue(GameRepository);
container
  .bind(TYPES.ContestItemRepository)
  .toConstantValue(ContestItemRepository);

// Middleware
container.bind(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind(TYPES.IsAuthorMiddleware).to(IsAuthorMiddleware);

// Controllers
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.UserController).to(UserController);
container.bind(TYPES.ContestController).to(ContestController);
container.bind(TYPES.GameController).to(GameController);

export default container;
