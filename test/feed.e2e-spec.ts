import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import { join } from 'path';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('FeedController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdFeedId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Crie o usuário de teste e verifique o status
    const registerRes = await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        name: 'Usuário Teste',
        birthDate: '2000-01-01',
        email: 'teste@teste.com',
        phone: '11999999969',
        password: 'teste123',
      });
    console.log('Registro:', registerRes.status, registerRes.body);
    expect([200, 201, 500]).toContain(registerRes.status);

    // Login e obtenção do token JWT
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'teste@teste.com', password: 'teste123' });
    console.log('Login:', loginRes.status, loginRes.body);
    expect(loginRes.status).toBe(200);
    jwtToken = loginRes.body.access_token;
  });

  it('deve criar um feed com imagem', async () => {
    const imagePath = join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, Buffer.alloc(10));
    }

    const res = await request(app.getHttpServer())
      .post('/feeds')
      .set('Authorization', `Bearer ${jwtToken}`)
      .field('caption', 'Meu feed de teste')
      .attach('file', imagePath);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('mediaUrl');
    expect(res.body.caption).toBe('Meu feed de teste');
    expect(res.body.mediaUrl).toMatch(/uploads\/.+\.jpg/);

    createdFeedId = res.body.id;
  });

  it('deve listar todos os feeds', async () => {
    const res = await request(app.getHttpServer())
      .get('/feeds')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve buscar um feed pelo id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/feeds/${createdFeedId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdFeedId);
  });

  it('deve atualizar o caption do feed', async () => {
    const res = await request(app.getHttpServer())
      .put(`/feeds/${createdFeedId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ caption: 'Caption atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.caption).toBe('Caption atualizado');
  });

  it('deve remover o feed', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/feeds/${createdFeedId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
