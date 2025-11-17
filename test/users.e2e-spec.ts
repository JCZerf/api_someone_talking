import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await app
      .get('UserRepository')
      .query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
  });

  it('should create a user with valid data', async () => {
    const userData = {
      name: 'João',
      birthDate: '2000-01-01',
      email: 'joao@email.com',
      phone: '11999999999',
      password: 'senha123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should fail with invalid email', async () => {
    const userData = {
      name: 'Maria',
      birthDate: '2000-01-01',
      email: 'invalid-email',
      phone: '11999999999',
      password: 'senha123',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(400);
  });

  it('should fail with invalid phone', async () => {
    const userData = {
      name: 'Carlos',
      birthDate: '2000-01-01',
      email: 'carlos@email.com',
      phone: '12345',
      password: 'senha123',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(400);
  });

  it('should fail if user is under 16 years old', async () => {
    const userData = {
      name: 'Ana',
      birthDate: '2015-01-01',
      email: 'ana@email.com',
      phone: '11999999999',
      password: 'senha123',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(400);
  });
});
