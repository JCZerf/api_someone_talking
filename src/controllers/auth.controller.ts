import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    this.logger.log(`Tentativa de login para o email: ${body.email}`);
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      this.logger.warn(`Login falhou para o email: ${body.email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
    this.logger.log(`Login bem-sucedido para o email: ${body.email}`);
    return this.authService.login(user);
  }

  @Post('registration')
  @HttpCode(200)
  async registration(@Body() userData: any) {
    this.logger.log(`Tentativa de registro para o email: ${userData.email}`);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      throw new BadRequestException('Email deve estar em um formato válido.');
    }
    const telefoneRegex = /^\d{11}$/;
    if (!userData.phone || !telefoneRegex.test(userData.phone)) {
      throw new BadRequestException(
        'Telefone deve conter 11 dígitos numéricos (formato pt-BR).',
      );
    }
    if (!userData.birthDate) {
      throw new BadRequestException('Data de nascimento é obrigatória.');
    }
    const dateOfBirth = new Date(userData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const birthDatePassed =
      today.getMonth() > dateOfBirth.getMonth() ||
      (today.getMonth() === dateOfBirth.getMonth() &&
        today.getDate() >= dateOfBirth.getDate());
    const ageFinal = birthDatePassed ? age : age - 1;
    if (ageFinal < 16) {
      throw new BadRequestException('Usuário deve ter pelo menos 16 anos.');
    }

    // Criação do usuário
    const user = await this.authService.register(userData);
    this.logger.log(`Registro bem-sucedido para o email: ${userData.email}`);
    return user;
  }
}
