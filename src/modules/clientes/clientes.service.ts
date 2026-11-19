
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    await this.validarTelefono(createClienteDto.telefono);

    return this.prisma.cliente.create({ data: createClienteDto });
  }

  findAll() {
    return this.prisma.cliente.findMany();
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException(`No existe un cliente con id ${id}.`);
    }

    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id);

    if (updateClienteDto.telefono) {
      await this.validarTelefono(updateClienteDto.telefono, id);
    }

    return this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const reservas = await this.prisma.reserva.count({
      where: { clienteId: id },
    });

    if (reservas > 0) {
      throw new ConflictException(
        'No se puede eliminar el cliente porque tiene reservas.',
      );
    }

    return this.prisma.cliente.delete({ where: { id } });
  }

  private async validarTelefono(telefono: string, clienteId?: number) {
    const existente = await this.prisma.cliente.findUnique({
      where: { telefono },
      select: { id: true },
    });

    if (existente && existente.id !== clienteId) {
      throw new ConflictException('Ya existe un cliente con ese teléfono.');
    }
  }
}

