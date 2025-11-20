import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FeedLikeService } from './feed.like.service';

@Controller('feeds/:feedId/likes')
export class FeedLikeController {
  constructor(private readonly feedLikeService: FeedLikeService) {}

  @Post()
  async likeFeed(
    @Param('feedId') feedId: string,
    @Body('userId') userId: string,
  ) {
    return this.feedLikeService.likeFeed(feedId, userId);
  }

  @Delete()
  async unlikeFeed(
    @Param('feedId') feedId: string,
    @Body('userId') userId: string,
  ) {
    await this.feedLikeService.unlikeFeed(feedId, userId);
    return { message: 'Like removed' };
  }

  @Get('count')
  async countLikes(@Param('feedId') feedId: string) {
    const count = await this.feedLikeService.countLikes(feedId);
    return { count };
  }
}
