import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateHorarioDto {
  @IsString({ message: 'La hora debe ser un texto.' })
  @IsNotEmpty({ message: 'La hora es obligatoria.' })
  @Matches(/^(0[89]|1[0-9]|2[0-3]):00$/, {
    message: 'La hora debe ser un turno en punto entre 08:00 y 23:00 (por ejemplo, 18:00).',
  })
  hora: string;
}