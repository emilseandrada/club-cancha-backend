import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { CanchasModule } from '../canchas/canchas.module';
import { ClientesModule } from '../clientes/clientes.module';
import { HorariosModule } from '../horarios/horarios.module';
import { ReservasModule } from '../reservas/reservas.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CanchasModule,
    ClientesModule,
    HorariosModule,
    ReservasModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
