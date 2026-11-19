import {ConflictException,Injectable,UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { isPrismaUniqueConstraintError } from '../prisma/prisma-error.util';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hashPassword, verifyPassword } from './password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const passwordHash = await hashPassword(registerAuthDto.password);

    try {
      return await this.prisma.usuario.create({
        data: {
          nombre: registerAuthDto.nombre,
          email: registerAuthDto.email,
          password: passwordHash,
        },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          creadoEn: true,
        },
      });
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictException('Ya existe un usuario con ese correo.');
      }

      throw error;
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (
      !usuario ||
      !(await verifyPassword(loginAuthDto.password, usuario.password))
    ) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      access_token: accessToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
