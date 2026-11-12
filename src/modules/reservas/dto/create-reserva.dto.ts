
import {
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsIn,
  IsBoolean,
  IsOptional,
  Min,
  Equals,
} from 'class-validator';

export class CreateReservaDto {
  @IsInt({ message: 'La cancha debe ser un número entero.' }) //Si canchaId es "dos" → 400
  @Min(1, { message: 'La cancha debe tener un ID positivo.' })
  canchaId: number;

  @IsInt({ message: 'El cliente debe ser un número entero.' }) //Si falta clienteId → 400
  @Min(1, { message: 'El cliente debe tener un ID positivo.' })
  clienteId: number;

  @IsInt({ message: 'El horario debe ser un número entero.' })
  @Min(1, { message: 'El horario debe tener un ID positivo.' })
  horarioId: number;

  @IsInt({ message: 'El usuario debe ser un número entero.' })
  @Min(1, { message: 'El usuario debe tener un ID positivo.' })
  usuarioId: number;

  @IsDateString({}, { message: 'La fecha debe ser válida.' })
  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  fecha: string;

  @IsIn([1, 1.5, 2], {
    message: 'La duración debe ser 1, 1.5 o 2 horas.',
  })
  duracion: number;

  @IsBoolean({ message: 'La política debe ser un valor booleano.' }) //Si politica es "si" → 400
  @Equals(true, {
    message: 'Debe aceptar la política de cancelación.',
  })
  politica: boolean;

  @IsOptional()
  @IsIn(['reservada', 'cancelada'], {                         //Cancelar una reserva con PATCH → 200
    message: 'El estado debe ser reservada o cancelada.', 
  })
  estado?: string;
}
