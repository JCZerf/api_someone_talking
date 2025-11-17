import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../models/feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async create(data: Partial<Feed>): Promise<Feed> {
    const feed = this.feedRepository.create(data);
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
