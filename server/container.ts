import { Container, interfaces } from 'inversify';
import 'reflect-metadata';

import { TYPES } from './inversify.types';

import UserService from './services/UserService';
import CloudinaryService from './services/CloudinaryService';
import JwtService from './services/JwtService';
import PasswordHashService from './services/PasswordHashService';
import GameService from './services/GameService';
import EmailService from './services/EmailService';
import ContestService from './services/ContestService';
import AuthService from './services/AuthService';

import UserRepository from './repositories/UserRepository';
import ContestRepository from './repositories/ContestRepository';
import ContestItemRepository from './repositories/ContestItemRepository';
import GameRepository from './repositories/GameRepository';

import UserController from './controllers/user/UserController';
import ContestController from './controllers/contest/ContestController';
import GameController from './controllers/game/GameController';
import AuthController from './controllers/auth/AuthController';
import TaskController from './controllers/task/TaskController';

import IsAuthorMiddleware from './middleware/IsAuthorMiddleware';
import AuthMiddleware from './middleware/AuthMiddleware';

let container: interfaces.Container = new Container();
export const middlewares = new Container();
export const controllers = new Container();
export const services = new Container();
export const repositories = new Container();

// Services
services.bind(TYPES.AuthService).to(AuthService);
services.bind(TYPES.UserService).to(UserService);
services.bind(TYPES.JwtService).to(JwtService);
services.bind(TYPES.GameService).to(GameService);
services.bind(TYPES.EmailService).to(EmailService);
services.bind(TYPES.ContestService).to(ContestService);
services.bind(TYPES.CloudinaryService).to(CloudinaryService);
services.bind(TYPES.PasswordHashService).to(PasswordHashService);

// Repositories
repositories.bind(TYPES.UserRepository).to(UserRepository);
repositories.bind(TYPES.ContestRepository).to(ContestRepository);
repositories.bind(TYPES.GameRepository).to(GameRepository);
repositories.bind(TYPES.ContestItemRepository).to(ContestItemRepository);

// Middleware
middlewares.bind(TYPES.AuthMiddleware).to(AuthMiddleware);
middlewares.bind(TYPES.IsAuthorMiddleware).to(IsAuthorMiddleware);

// Controllers
controllers.bind(TYPES.AuthController).to(AuthController);
controllers.bind(TYPES.UserController).to(UserController);
controllers.bind(TYPES.ContestController).to(ContestController);
controllers.bind(TYPES.GameController).to(GameController);
controllers.bind(TYPES.TaskController).to(TaskController);

container = Container.merge(container, controllers);
container = Container.merge(container, middlewares);
container = Container.merge(container, repositories);
container = Container.merge(container, services);

export default container;
