import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post(':id/profile-photo')
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
  async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Omit<User, 'password'> | null> {
    const profilePhotoUrl = file ? `/uploads/${file.filename}` : '';
    const user = await this.usersService.updateProfilePhoto(
      id,
      profilePhotoUrl,
    );
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Buscando todos os usuários');
    const users = await this.usersService.findAll();
    return users.map(toUserResponseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto | null> {
    this.logger.log(`Buscando usuário com id: ${id}`);
    const user = await this.usersService.findOne(id);
    if (!user) return null;
    return toUserResponseDto(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    this.logger.log(`Atualizando usuário com id: ${id}`);
    const user = await this.usersService.update(id, userData);
    if (!user) return null;
    return toUserResponseDto(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Removendo usuário com id: ${id}`);
    await this.usersService.remove(id);
    return { message: 'Usuário deletado com sucesso.' };
  }
}

function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    profilePhotoUrl: user.profilePhotoUrl,
    name: user.name,
    birthDate: user.birthDate,
    email: user.email,
    phone: user.phone,
  };
}
