import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { FeedComment } from './feed.comment.entity';
import { Feed } from './feed.entity';
import { FeedLike } from './feed.like.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FeedComment)
    private readonly commentRepository: Repository<FeedComment>,
    @InjectRepository(FeedLike)
    private readonly likeRepository: Repository<FeedLike>,
  ) {}

  async create(data: {
    caption: string;
    mediaUrl?: string;
    userId: string;
  }): Promise<Feed> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (!user) throw new Error('Usuário não encontrado');
    const feed = this.feedRepository.create({
      caption: data.caption,
      mediaUrl: data.mediaUrl,
      user,
    });
    return this.feedRepository.save(feed);
  }

  async findAll(): Promise<Feed[]> {
    return this.feedRepository.find();
  }

  async findOne(id: string): Promise<Feed | null> {
    return this.feedRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<Feed & { removeImage?: boolean; mediaUrl?: string | null }>,
  ): Promise<Feed | null> {
    const feed = await this.findOne(id);
    if (!feed) return null;

    // Remover imagem antiga se solicitado
    if (data.removeImage && feed.mediaUrl) {
      const filePath = '.' + feed.mediaUrl;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
      data.mediaUrl = null;
      delete data.removeImage;
    }

    // Trocar imagem: remove a antiga se vier uma nova
    if (data.mediaUrl && feed.mediaUrl && data.mediaUrl !== feed.mediaUrl) {
      const oldFilePath = '.' + feed.mediaUrl;
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
    }

    await this.feedRepository.update(id, data);
    return this.findOne(id);
  }

  async findAllWithLikeCountAndLikedByMe(userId: string): Promise<Array<any>> {
    const feeds = await this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .loadRelationCountAndMap('feed.likeCount', 'feed.likes')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(1)')
          .from('feed_like', 'like')
          .where('like.feedId = feed.id')
          .andWhere('like.userId = :userId', { userId });
      }, 'likedByMeCount')
      .getRawAndEntities();

    return feeds.entities.map((feed, idx) => {
      console.log({
        feedId: feed.id,
        userId,
        likeCount: (feed as any).likeCount,
        likedByMeCount: feeds.raw[idx].likedByMeCount,
        likedByMe: feeds.raw[idx].likedByMeCount > 0,
      });
      return {
        ...feed,
        userName: feed.user?.name,
        likeCount: (feed as any).likeCount ?? 0,
        likedByMe: feeds.raw[idx].likedByMeCount > 0,
      };
    });
  }

  async remove(id: string): Promise<void> {
    await this.likeRepository.delete({ feed: { id } });
    await this.commentRepository.delete({ feed: { id } });

    // Remover arquivo de mídia, se existir
    const feed = await this.findOne(id);
    if (feed?.mediaUrl) {
      const filePath = '.' + feed.mediaUrl;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }

    // Remover o feed
    await this.feedRepository.delete(id);
  }
}
