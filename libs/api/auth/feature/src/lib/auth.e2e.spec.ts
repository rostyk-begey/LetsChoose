import { IDatabaseService } from '@lets-choose/api/abstract';
import { ApiAuthFeatureModule } from '@lets-choose/api/auth/feature';
import { DatabaseService } from '@lets-choose/api/common/services';
import { createTestingModule } from '@lets-choose/api/testing/utils';
import { AuthLoginDto, AuthRegisterDto } from '@lets-choose/common/dto';
import { AuthGoogleLoginDto } from '@lets-choose/common/dto';
import { userBuilder } from '@lets-choose/api/testing/builders';
import { API_ROUTES } from '@lets-choose/common/utils';
import { HttpServer, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import * as faker from 'faker';
import { OAuth2Client } from 'google-auth-library';
import {
  LoginTicket,
  TokenPayload,
} from 'google-auth-library/build/src/auth/loginticket';
import { Connection } from 'mongoose';
import request from 'supertest';

const ticket = { getPayload: jest.fn() } as unknown as jest.Mocked<LoginTicket>;
const verifyIdToken = jest.fn(() => ({ ticket }));
const MockedOAuth2Client = jest.fn(() => ({
  verifyIdToken,
})) as unknown as jest.MockedClass<typeof OAuth2Client>;
jest.doMock('google-auth-library', () => ({
  MockedOAuth2Client,
}));

// TODO: enable auth e2e tests
describe.skip('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let dbConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestingModule({
      imports: [ApiAuthFeatureModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    dbConnection = app.get<IDatabaseService>(DatabaseService).getConnection();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  it('/api/auth/login (POST)', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as any);
    const { id, ...user } = userBuilder({ traits: 'realId' });
    await dbConnection.collection('users').insertOne(user as any);
    const data: AuthLoginDto = {
      login: user.username,
      password: user.password,
    };

    const { status, body } = await request(httpServer)
      .post(API_ROUTES.AUTH.LOGIN)
      .send(data);

    expect(status).toEqual(201);
    expect(body).toMatchObject({
      userId: id,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('/api/auth/register (POST)', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as any);
    const { id, ...user } = userBuilder({ traits: 'realId' });
    const data: AuthRegisterDto = {
      email: user.email,
      username: user.username,
      password: user.password,
    };

    const { status, body } = await request(httpServer)
      .post(API_ROUTES.AUTH.REGISTER)
      .send(data);

    expect(status).toEqual(201);
    expect(body).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('/api/auth/login/google (POST)', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as any);
    const ticketPayload = {
      email: faker.internet.email(),
      picture: faker.internet.avatar(),
    } as TokenPayload;
    ticket.getPayload.mockReturnValueOnce(ticketPayload);
    const { id, ...user } = userBuilder({ traits: 'realId' });
    await dbConnection.collection('users').insertOne(user as any);
    const data: AuthGoogleLoginDto = {
      token: faker.random.alphaNumeric(20),
    };

    const { status, body } = await request(httpServer)
      .post(API_ROUTES.AUTH.LOGIN_GOOGLE)
      .send(data);

    expect(status).toEqual(201);
    expect(body).toMatchObject({
      userId: id,
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  test.todo('/api/auth/logout');
  test.todo('/api/auth/password/forgot');
  test.todo('/api/auth/password/update');
  test.todo('/api/auth/password/reset/:token');
  test.todo('/api/auth/token');
  test.todo('/api/auth/email/confirm/:token');
});
