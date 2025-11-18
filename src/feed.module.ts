import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './controllers/feed.controller';
import { Feed } from './models/feed.entity';
import { User } from './models/users.entity';
import { FeedService } from './services/feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
