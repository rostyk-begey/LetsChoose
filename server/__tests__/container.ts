import { Container, interfaces } from 'inversify';
import 'reflect-metadata';

import JwtService from '../services/JwtService';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import GameService from '../services/GameService';
import EmailService from '../services/EmailService';
import ContestService from '../services/ContestService';
import CloudinaryService from '../services/CloudinaryService';
import PasswordHashService from '../services/PasswordHashService';

import GameRepository from '../repositories/GameRepository';
import UserRepository from '../repositories/UserRepository';
import ContestRepository from './mocks/repositories/ContestRepository';
import ContestItemRepository from './mocks/repositories/ContestItemRepository';

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
container.bind(TYPES.CloudinaryService).to(CloudinaryService);
container.bind(TYPES.JwtService).to(JwtService);
container.bind(TYPES.GameService).to(GameService);
container.bind(TYPES.EmailService).to(EmailService);
container.bind(TYPES.ContestService).to(ContestService);
container.bind(TYPES.PasswordHashService).to(PasswordHashService);

// Repositories
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.ContestRepository).to(ContestRepository);
container.bind(TYPES.GameRepository).to(GameRepository);
container.bind(TYPES.ContestItemRepository).to(ContestItemRepository);

// Middleware
container.bind(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind(TYPES.IsAuthorMiddleware).to(IsAuthorMiddleware);

// Controllers
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.UserController).to(UserController);
container.bind(TYPES.ContestController).to(ContestController);
container.bind(TYPES.GameController).to(GameController);

export default container;
