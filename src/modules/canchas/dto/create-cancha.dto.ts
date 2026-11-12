
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export class CreateCanchaDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(50, {
    message: 'El nombre no puede superar los 50 caracteres.',
  })
  nombre: string;

  @IsInt({ message: 'El deporte debe ser un número entero.' })
  @Min(1, { message: 'El deporte debe tener un ID positivo.' })
  deporteId: number;
}


