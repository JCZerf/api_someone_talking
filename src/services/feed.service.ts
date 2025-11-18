import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users.entity';
import { Repository } from 'typeorm';
import { Feed } from '../models/feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async update(id: string, data: Partial<Feed>): Promise<Feed | null> {
    await this.feedRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.feedRepository.delete(id);
  }
}
