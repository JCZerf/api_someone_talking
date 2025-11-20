import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/users.entity';
import { Feed } from './feed.entity';

@Entity()
export class FeedComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Feed, (feed) => feed.comments)
  feed: Feed;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  user: User;

  @Column({ length: 280 })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
