import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Feed } from './feed.entity';
import { FeedLike } from './feed.like.entity';

@Injectable()
export class FeedLikeService {
  constructor(
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async likeFeed(feedId: string, userId: string): Promise<FeedLike> {
    const feed = await this.feedRepository.findOne({ where: { id: feedId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!feed || !user) {
      throw new Error('Feed or User not found');
    }

    const existingLike = await this.feedLikeRepository.findOne({
      where: { feed: { id: feedId }, user: { id: userId } },
    });

    if (existingLike) {
      throw new BadRequestException('Already liked');
    }

    const like = this.feedLikeRepository.create({ feed, user });
    return this.feedLikeRepository.save(like);
  }

  async unlikeFeed(feedId: string, userId: string): Promise<void> {
    const like = await this.feedLikeRepository.findOne({
      where: { feed: { id: feedId }, user: { id: userId } },
    });

    if (!like) {
      throw new Error('Like not found');
    }

    await this.feedLikeRepository.remove(like);
  }

  async countLikes(feedId: string): Promise<number> {
    return this.feedLikeRepository.count({ where: { feed: { id: feedId } } });
  }
}
