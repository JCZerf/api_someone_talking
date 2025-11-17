import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/models/users.entity';
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
    const userRepo = app.get(getRepositoryToken(User));
    await userRepo.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
  });

  it('should get all users', async () => {
    const userData = {
      name: 'Carlos',
      birthDate: '1990-01-01',
      email: 'carlos@email.com',
      phone: '11988888888',
      password: 'senha123',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('email', userData.email);
    expect(response.body[0]).not.toHaveProperty('password');
  });

  it('should update a user', async () => {
    const userData = {
      name: 'Carlos',
      birthDate: '1990-01-01',
      email: 'carlos@email.com',
      phone: '11988888888',
      password: 'senha123',
    };

    const regRes = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(200);

    const userId = regRes.body.id;

    const updatedData = { name: 'Carlos Silva' };

    const updateRes = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updatedData)
      .expect(200);

    expect(updateRes.body).toHaveProperty('name', updatedData.name);

    const getRes = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(getRes.body).toHaveProperty('name', updatedData.name);
  });

  it('should delete a user', async () => {
    const userData = {
      name: 'Carlos',
      birthDate: '1990-01-01',
      email: 'carlos@email.com',
      phone: '11988888888',
      password: 'senha123',
    };

    const regRes = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userData)
      .expect(200);

    const userId = regRes.body.id;

    const delRes = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200);

    expect(delRes.body).toHaveProperty(
      'message',
      'Usuário deletado com sucesso.',
    );

    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .then((res) => expect(res.body).toEqual({}));
  });
});
