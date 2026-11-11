
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsIn,
  IsBoolean,
  IsPositive,
  Min,
  MinLength,
  MaxLength,
  Matches,
  Equals,
} from 'class-validator';

export class CreateReservaDto {

  @IsString({ message: 'El apellido debe ser un texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  @MaxLength(100, { message: 'El apellido no puede superar los 100 caracteres.' })
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'El apellido solo puede contener letras.',
  })
  apellido: string;

  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres.' })
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'El nombre solo puede contener letras.',
  })
  nombre: string;

  @IsString({ message: 'El celular debe ser un texto.' })
  @IsNotEmpty({ message: 'El celular es obligatorio.' })
  @Matches(/^[0-9]+$/, {
    message: 'El celular debe contener solo números.',
  })
  celular: string;

  @IsString({ message: 'El deporte debe ser un texto.' })
  @IsIn(['Fútbol', 'Pádel'], {
    message: 'El deporte debe ser Fútbol o Pádel.',
  })
  tipo: string;

  @IsNumber({}, { message: 'La cancha debe ser un número.' })
  @IsNotEmpty({ message: 'La cancha es obligatoria.' })
  @IsPositive({ message: 'La cancha debe tener un ID positivo.' })
  canchaId: number;

  @IsDateString({}, { message: 'La fecha debe ser válida.' })
  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  fecha: string;

  @IsString({ message: 'La hora debe ser un texto.' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora debe tener formato HH:mm.',
  })
  hora: string;

  @IsNumber({}, { message: 'La duración debe ser un número.' })
  @IsPositive({ message: 'La duración debe ser mayor que cero.' })
  duracion: number;

  @IsNumber({}, { message: 'La seña debe ser un número.' })
  @Min(0, { message: 'La seña no puede ser negativa.' })
  sena: number;

  @IsBoolean({ message: 'La política debe ser un valor booleano.' })
  @Equals(true, {
    message: 'Debe aceptar la política de cancelación.',
  })
  politica: boolean;
}
