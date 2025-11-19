import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
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
    const userRepo = app.get(getRepositoryToken(User));
    await userRepo.delete({ email: 'joao@email.com' });
    await userRepo.delete({ email: 'maria@email.com' });
  });

  it('should login with valid credentials', async () => {
    const userData = {
      name: 'João',
      birthDate: '2000-01-01',
      email: 'joao@email.com',
      phone: '11999999989',
      password: 'senha123',
    };

    console.log('Dados para registro:', userData);

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(200);

    console.log('Dados para login:', {
      email: userData.email,
      password: userData.password,
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });

  it('should fail login with wrong password', async () => {
    const userData = {
      name: 'Maria',
      birthDate: '2000-01-01',
      email: 'maria@email.com',
      phone: '11999999979',
      password: 'senha123',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' })
      .expect(401);
  });

  it('should fail login with non-existent email', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'notfound@email.com', password: 'senha123' })
      .expect(401);
  });
});
