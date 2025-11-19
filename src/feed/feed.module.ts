import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { FeedController } from './feed.controller';
import { Feed } from './feed.entity';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
