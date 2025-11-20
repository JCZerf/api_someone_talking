import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class RegistrationUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser um texto.' })
  name: string;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  @IsDateString(
    {},
    { message: 'A data de nascimento deve estar no formato DD-MM-YYYY.' },
  )
  birthDate: string;

  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'Email deve estar em um formato válido.' })
  email: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @Matches(/^\d{11}$/, {
    message: 'Telefone deve conter 11 dígitos numéricos (formato pt-BR).',
  })
  phone: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString({ message: 'A senha deve ser um texto.' })
  password: string;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string | null;
}
