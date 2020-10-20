import { Container, interfaces } from 'inversify';
import 'reflect-metadata';

import UserService from './services/UserService';
import CloudinaryService from './services/CloudinaryService';
import JwtService from './services/JwtService';
import PasswordHashService from './services/PasswordHashService';
import GameService from './services/GameService';
import EmailService from './services/EmailService';
import ContestService from './services/ContestService';

import UserRepository from './repositories/UserRepository';
import ContestRepository from './repositories/ContestRepository';
import ContestItemRepository from './repositories/ContestItemRepository';
import GameRepository from './repositories/GameRepository';
import UserController from './controllers/user/UserController';
import ContestController from './controllers/contest/ContestController';
import GameController from './controllers/game/GameController';
import AuthController from './controllers/auth/AuthController';
import AuthService from './services/AuthService';
import IsAuthorMiddleware from './middleware/IsAuthorMiddleware';
import AuthMiddleware from './middleware/AuthMiddleware';

let container: interfaces.Container = new Container();
export const middlewares = new Container();
export const controllers = new Container();
export const services = new Container();
export const repositories = new Container();

// Services
services.bind(AuthService).to(AuthService);
services.bind(UserService).to(UserService);
services.bind(CloudinaryService).to(CloudinaryService);
services.bind(JwtService).to(JwtService);
services.bind(GameService).to(GameService);
services.bind(EmailService).to(EmailService);
services.bind(ContestService).to(ContestService);
services.bind(PasswordHashService).to(PasswordHashService);

// Repositories
repositories.bind(UserRepository).to(UserRepository);
repositories.bind(ContestRepository).to(ContestRepository);
repositories.bind(GameRepository).to(GameRepository);
repositories.bind(ContestItemRepository).to(ContestItemRepository);

// Middleware
middlewares.bind(AuthMiddleware).to(AuthMiddleware);
middlewares.bind(IsAuthorMiddleware).to(IsAuthorMiddleware);

// Controllers
controllers.bind(AuthController).to(AuthController);
controllers.bind(UserController).to(UserController);
controllers.bind(ContestController).to(ContestController);
controllers.bind(GameController).to(GameController);

container = Container.merge(container, controllers);
container = Container.merge(container, middlewares);
container = Container.merge(container, repositories);
container = Container.merge(container, services);

export default container;
