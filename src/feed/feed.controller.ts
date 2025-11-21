import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Feed } from './feed.entity';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() body: { caption: string },
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<Feed> {
    const mediaUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.feedService.create({
      caption: body.caption,
      mediaUrl,
      userId: req.user.userId,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Req() req,
  ): Promise<Array<Feed & { likeCount: number; likedByMe: boolean }>> {
    return this.feedService.findAllWithLikeCountAndLikedByMe(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Feed | null> {
    return this.feedService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Feed> & { removeImage?: boolean },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Feed | null> {
    if (file) {
      data.mediaUrl = `/uploads/${file.filename}`;
    }
    return this.feedService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.feedService.remove(id);
  }
}
