import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { FeedComment } from './feed.comment.entity';
import { FeedController } from './feed.controller';
import { Feed } from './feed.entity';
import { FeedLikeController } from './feed.like.controller';
import { FeedLike } from './feed.like.entity';
import { FeedLikeService } from './feed.like.service';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, FeedComment, FeedLike, User])],
  controllers: [FeedController, FeedLikeController],
  providers: [FeedService, FeedLikeService],
})
export class FeedModule {}
