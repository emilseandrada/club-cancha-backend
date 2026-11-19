import { ConflictException,Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Rol } from '../../generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';


const datosPublicos = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  creadoEn: true,
};
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({ select: datosPublicos });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: datosPublicos,
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con id ${id}.`);
    }

    return usuario;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email) {
      await this.validarEmail(updateUserDto.email, id);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: {
        nombre: updateUserDto.nombre,
        email: updateUserDto.email,
        rol: updateUserDto.rol as Rol | undefined,
      },
      select: datosPublicos,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const reservas = await this.prisma.reserva.count({
      where: { usuarioId: id },
    });
    if (reservas > 0) {
      throw new ConflictException(
        'No se puede eliminar el usuario porque registró reservas.',
      );
    }

    return this.prisma.usuario.delete({
      where: { id },
      select: datosPublicos,
    });
  }

  private async validarEmail(email: string, usuarioId?: number) {
    const existente = await this.prisma.usuario.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existente && existente.id !== usuarioId) {
      throw new ConflictException('Ya existe un usuario con ese correo.');
    }
  }
}
