import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Feed } from '../feed/feed.entity';
import { User } from '../users/users.entity';

@Entity()
@Unique(['feed', 'user'])
export class FeedLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Feed, (feed) => feed.likes)
  feed: Feed;

  @ManyToOne(() => User, (user) => user.likes, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
