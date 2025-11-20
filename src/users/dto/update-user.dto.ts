import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto.' })
  name?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data de nascimento deve estar no formato DD-MM-YYYY.' },
  )
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser um texto.' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'A URL da foto de perfil deve ser um texto.' })
  profilePhotoUrl?: string;
}
