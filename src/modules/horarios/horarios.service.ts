import {
   ConflictException,
   Injectable,
   NotFoundException,
 } from '@nestjs/common';
 import { PrismaService } from '../prisma/prisma.service';
 import { CreateHorarioDto } from './dto/create-horario.dto';
 import { UpdateHorarioDto } from './dto/update-horario.dto';

 @Injectable()
 export class HorariosService {
   constructor(private readonly prisma: PrismaService) {}

   async create(createHorarioDto: CreateHorarioDto) {
     await this.validarHora(createHorarioDto.hora);

     return this.prisma.horario.create({ data: createHorarioDto });
   }

   findAll() {
     return this.prisma.horario.findMany({ orderBy: { hora: 'asc' } });
   }

   async findOne(id: number) {
     const horario = await this.prisma.horario.findUnique({
       where: { id },
     });

     if (!horario) {
       throw new NotFoundException(`No existe un horario con id ${id}.`);
     }

     return horario;
   }

   async update(id: number, updateHorarioDto: UpdateHorarioDto) {
     await this.findOne(id);

     if (updateHorarioDto.hora) {
       await this.validarHora(updateHorarioDto.hora, id);
     }

     return this.prisma.horario.update({
       where: { id },
       data: updateHorarioDto,
     });
   }

   async remove(id: number) {
     await this.findOne(id);

     const reservas = await this.prisma.reserva.count({
       where: { horarioId: id },
     });
     if (reservas > 0) {
       throw new ConflictException(
         'No se puede eliminar el horario porque tiene reservas.',
       );
     }

     return this.prisma.horario.delete({ where: { id } });
   }

   private async validarHora(hora: string, horarioId?: number) {
     const existente = await this.prisma.horario.findUnique({
       where: { hora },
       select: { id: true },
     });

     if (existente && existente.id !== horarioId) {
       throw new ConflictException('Ese horario ya existe.');
     }
   }

 }