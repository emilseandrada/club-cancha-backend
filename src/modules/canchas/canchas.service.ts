
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Injectable()
export class CanchasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCanchaDto: CreateCanchaDto) {
    await this.validarNombre(createCanchaDto.nombre);
    await this.validarDeporte(createCanchaDto.deporteId);

    return this.prisma.cancha.create({ data: createCanchaDto });
  }

  findAll() {
    return this.prisma.cancha.findMany({ include: { deporte: true } });
  }

  async findOne(id: number) {
    const cancha = await this.prisma.cancha.findUnique({
      where: { id },
      include: { deporte: true },
    });

    if (!cancha) {
      throw new NotFoundException(`No existe una cancha con id ${id}.`);
    }

    return cancha;
  }

  async update(id: number, updateCanchaDto: UpdateCanchaDto) {
    await this.findOne(id);

    if (updateCanchaDto.nombre) {
      await this.validarNombre(updateCanchaDto.nombre, id);
    }
    if (updateCanchaDto.deporteId) {
      await this.validarDeporte(updateCanchaDto.deporteId);
    }

    return this.prisma.cancha.update({
      where: { id },
      data: updateCanchaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const reservas = await this.prisma.reserva.count({
      where: { canchaId: id },
    });
    if (reservas > 0) {
      throw new ConflictException(
        'No se puede eliminar la cancha porque tiene reservas.',
      );
    }

    return this.prisma.cancha.delete({ where: { id } });
  }

  private async validarNombre(nombre: string, canchaId?: number) {
    const existente = await this.prisma.cancha.findUnique({
      where: { nombre },
      select: { id: true },
    });

    if (existente && existente.id !== canchaId) {
      throw new ConflictException('Ya existe una cancha con ese nombre.');
    }
  }

  private async validarDeporte(deporteId: number) {
    const deporte = await this.prisma.deporte.findUnique({
      where: { id: deporteId },
    });

    if (!deporte) {
      throw new NotFoundException(`No existe un deporte con id ${deporteId}.`);
    }
  }
}
