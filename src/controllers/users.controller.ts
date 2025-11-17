import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
import { User } from '../models/users.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    this.logger.log('Buscando todos os usuários');
    const users = await this.usersService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Omit<User, 'password'> | null> {
    this.logger.log(`Buscando usuário com id: ${id}`);
    const user = await this.usersService.findOne(id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User | null> {
    this.logger.log(`Atualizando usuário com id: ${id}`);
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Removendo usuário com id: ${id}`);
    await this.usersService.remove(id);
    return { message: 'Usuário deletado com sucesso.' };
  }
}
