import 'dotenv/config';
import { AppDataSource } from './data-source';
import { Feed } from './feed/feed.entity';
import { FeedLike } from './feed/feed.like.entity';
import { User } from './users/users.entity';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const feedRepo = AppDataSource.getRepository(Feed);
  const likeRepo = AppDataSource.getRepository(FeedLike);

  const devUser = userRepo.create({
    name: 'Usuário Dev',
    email: 'teste@teste.com',
    password: 'teste123',
    birthDate: new Date('1990-01-01'),
    phone: '11999999999',
  });
  await userRepo.save(devUser);

  const users: User[] = [];
  for (let i = 1; i <= 9; i++) {
    const user = userRepo.create({
      name: `Usuário ${i}`,
      email: `user${i}@example.com`,
      password: `password${i}`,
      birthDate: new Date(`199${i}-01-01`),
      phone: `1199999999${i}`,
    });
    users.push(await userRepo.save(user));
  }
  users.unshift(devUser);

  const feeds: Feed[] = [];
  for (let i = 1; i <= 10; i++) {
    const feed = feedRepo.create({
      caption: `Post de teste número ${i}`,
      mediaUrl: i % 2 === 0 ? `/uploads/teste${i}.jpg` : null,
      user: users[i % users.length],
    });
    feeds.push(await feedRepo.save(feed));
  }

  for (let i = 0; i < 10; i++) {
    const like = likeRepo.create({
      feed: feeds[i],
      user: users[i % users.length],
    });
    await likeRepo.save(like);
  }

  console.log('Seed concluído!');
  await AppDataSource.destroy();
}

seed();
