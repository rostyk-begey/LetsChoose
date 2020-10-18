import { Container } from 'inversify';
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

const container = new Container();

// Services
container.bind<UserService>(UserService).to(UserService);
container.bind<CloudinaryService>(CloudinaryService).to(CloudinaryService);
container.bind<JwtService>(JwtService).to(JwtService);
container.bind<GameService>(GameService).to(GameService);
container.bind<EmailService>(EmailService).to(EmailService);
container.bind<ContestService>(ContestService).to(ContestService);
container
  .bind<PasswordHashService>(PasswordHashService)
  .to(PasswordHashService);

// Repositories
container.bind<UserRepository>(UserRepository).to(UserRepository);
container.bind<ContestRepository>(ContestRepository).to(ContestRepository);
container.bind<GameRepository>(GameRepository).to(GameRepository);
container
  .bind<ContestItemRepository>(ContestItemRepository)
  .to(ContestItemRepository);

// Controllers
container.bind<UserController>(UserController).to(UserController);
container.bind<ContestController>(ContestController).to(ContestController);
container.bind<GameController>(GameController).to(GameController);

export default container;
