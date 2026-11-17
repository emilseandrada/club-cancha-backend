
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoReserva } from '../../generated/prisma/client';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservaDto: CreateReservaDto) {
    await this.validarRelaciones(createReservaDto);

    return this.prisma.reserva.create({
      data: {
        ...createReservaDto,
        fecha: new Date(createReservaDto.fecha),
        estado: createReservaDto.estado as EstadoReserva | undefined,
      },
    });
  }

  findAll() {
    return this.prisma.reserva.findMany({
      include: { cancha: true, cliente: true, horario: true },
      orderBy: { fecha: 'asc' },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: { cancha: true, cliente: true, horario: true },
    });

    if (!reserva) {
      throw new NotFoundException(`No existe una reserva con id ${id}.`);
    }

    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    await this.findOne(id);
    await this.validarRelaciones(updateReservaDto);

    return this.prisma.reserva.update({
      where: { id },
      data: {
        ...updateReservaDto,
        fecha: updateReservaDto.fecha
          ? new Date(updateReservaDto.fecha)
          : undefined,
        estado: updateReservaDto.estado as EstadoReserva | undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reserva.delete({ where: { id } });
  }

  // Comprueba que la cancha, el cliente, el horario y el usuario existan
  private async validarRelaciones(dto: UpdateReservaDto) {
    if (dto.canchaId) {
      const cancha = await this.prisma.cancha.findUnique({
        where: { id: dto.canchaId },
      });
      if (!cancha) {
        throw new NotFoundException(`No existe una cancha con id ${dto.canchaId}.`);
      }
    }

    if (dto.clienteId) {
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: dto.clienteId },
      });
      if (!cliente) {
        throw new NotFoundException(`No existe un cliente con id ${dto.clienteId}.`);
      }
    }

    if (dto.horarioId) {
      const horario = await this.prisma.horario.findUnique({
        where: { id: dto.horarioId },
      });
      if (!horario) {
        throw new NotFoundException(`No existe un horario con id ${dto.horarioId}.`);
      }
    }

    if (dto.usuarioId) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: dto.usuarioId },
      });
      if (!usuario) {
        throw new NotFoundException(`No existe un usuario con id ${dto.usuarioId}.`);
      }
    }
  }
}
