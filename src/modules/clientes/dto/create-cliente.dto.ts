
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateClienteDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres.' })
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'El nombre solo puede contener letras.',
  })
  nombre: string;

  @IsString({ message: 'El apellido debe ser un texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El apellido no puede superar los 50 caracteres.' })
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'El apellido solo puede contener letras.',
  })
  apellido: string;

  @IsString({ message: 'El teléfono debe ser un texto.' })
  @Matches(/^[0-9]{10}$/, {
    message: 'El teléfono debe tener 10 números, sin espacios ni guiones.',
  })
  telefono: string;
}
