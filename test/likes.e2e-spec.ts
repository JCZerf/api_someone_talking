import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Feed } from '../src/feed/feed.entity';
import { User } from '../src/users/users.entity';

describe('FeedLikeController (e2e)', () => {
  let app: INestApplication;
  let feedRepository: Repository<Feed>;
  let userRepository: Repository<User>;
  let feed: Feed;
  let user: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    feedRepository = moduleFixture.get<Repository<Feed>>(
      getRepositoryToken(Feed),
    );
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    // Cria usuário e feed para os testes
    user = userRepository.create({
      name: 'Test User Like',
      birthDate: new Date('1990-01-01'),
      email: 'testfeedlike@email.com',
      phone: '11999999992',
      password: 'senha123',
    });
    await userRepository.save(user);

    feed = feedRepository.create({
      caption: 'Test caption feed',
      mediaUrl: 'http://example.com/image.jpg',
      user,
    });
    await feedRepository.save(feed);
  });

  afterAll(async () => {
    await feedRepository.delete({ id: feed.id });
    await userRepository.delete({ email: 'testfeedlike@email.com' });
    await app.close();
  });

  it('should like a feed', async () => {
    const res = await request(app.getHttpServer())
      .post(`/feeds/${feed.id}/likes`)
      .send({ userId: user.id })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.feed.id).toBe(feed.id);
    expect(res.body.user.id).toBe(user.id);
  });

  it('should not allow duplicate likes', async () => {
    await request(app.getHttpServer())
      .post(`/feeds/${feed.id}/likes`)
      .send({ userId: user.id })
      .expect(400);
  });

  it('should count likes', async () => {
    const res = await request(app.getHttpServer())
      .get(`/feeds/${feed.id}/likes/count`)
      .expect(200);

    expect(res.body.count).toBe(1);
  });

  it('should unlike a feed', async () => {
    await request(app.getHttpServer())
      .delete(`/feeds/${feed.id}/likes`)
      .send({ userId: user.id })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/feeds/${feed.id}/likes/count`)
      .expect(200);

    expect(res.body.count).toBe(0);
  });
});
