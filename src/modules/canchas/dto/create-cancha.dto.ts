
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateCanchaDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(50, {
    message: 'El nombre no puede superar los 50 caracteres.',
  })
  nombre: string;

  @IsString({ message: 'El deporte debe ser un texto.' })
  @IsNotEmpty({ message: 'El deporte es obligatorio.' })
  @IsIn(['Fútbol 5', 'Fútbol 7', 'Pádel'], {
    message: 'El deporte debe ser Fútbol 5, Fútbol 7 o Pádel.',
  })
  deporte: string;

  @IsString({ message: 'El tipo debe ser un texto.' })
  @IsNotEmpty({ message: 'El tipo es obligatorio.' })
  @IsIn(['Fútbol', 'Pádel'], {
    message: 'El tipo debe ser Fútbol o Pádel.',
  })
  tipo: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser un texto.' })
  @MaxLength(255, {
    message: 'La imagen no puede superar los 255 caracteres.',
  })
  imagen?: string;
}

