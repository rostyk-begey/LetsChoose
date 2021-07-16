import { IDatabaseService } from '@abstract/database.service.interface';
import { AuthLoginDto } from '@lets-choose/common';
import { AuthRegisterDto } from '@lets-choose/common/src/dto/auth.dto';
import { userBuilder } from '@modules/user/__mocks__/user.repository';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';

import { AppModule } from '@modules/app/app.module';
import { TYPES } from '@src/injectable.types';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let dbConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    dbConnection = app
      .get<IDatabaseService>(TYPES.DatabaseService)
      .getConnection();
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
    await dbConnection.collection('users').insertOne(user);
    const data: AuthLoginDto = {
      login: user.username,
      password: user.password,
    };

    const { status, body } = await request(httpServer)
      .post('/api/auth/login')
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
      .post('/api/auth/register')
      .send(data);

    expect(status).toEqual(201);
    expect(body).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
