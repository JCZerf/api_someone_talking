import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log('Usuário encontrado:', user);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Senha confere?', passwordMatch);
      if (passwordMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    // Verifica se já existe usuário com o mesmo email
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado.');
    }
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Cria o usuário
    const newUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    // Retorna o usuário sem a senha
    const { password, ...result } = newUser;
    return result;
  }
}
