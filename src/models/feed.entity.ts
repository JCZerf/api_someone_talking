import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeedComment } from './feed.comment.entity';
import { FeedLike } from './feed.like.entity';
import { User } from './users.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 280 })
  caption: string;

  @Column({ nullable: true })
  mediaUrl: string; // URL da imagem ou vídeo

  @ManyToOne(() => User, (user) => user.feeds, { eager: true })
  user: User; // Autor da postagem

  @OneToMany(() => FeedLike, (like) => like.feed)
  likes: FeedLike[];

  @OneToMany(() => FeedComment, (comment) => comment.feed)
  comments: FeedComment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
