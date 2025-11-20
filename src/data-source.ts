import 'dotenv/config';
import { DataSource } from 'typeorm';
import { FeedComment } from './feed/feed.comment.entity';
import { Feed } from './feed/feed.entity';
import { FeedLike } from './feed/feed.like.entity';
import { User } from './users/users.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Feed, User, FeedComment, FeedLike],
  migrations: ['src/migrations/*{.ts,.js}'],
});
