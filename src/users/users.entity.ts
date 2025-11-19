import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FeedComment } from '../feed/feed.comment.entity';
import { Feed } from '../feed/feed.entity';
import { FeedLike } from '../feed/feed.like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  profilePhotoUrl: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @OneToMany(() => Feed, (feed) => feed.user)
  feeds: Feed[];

  @OneToMany(() => FeedLike, (like) => like.user)
  likes: FeedLike[];

  @OneToMany(() => FeedComment, (comment) => comment.user)
  comments: FeedComment[];
}
