import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservasModule } from './reservas/reservas.module';
import { ClientesModule } from './clientes/clientes.module';
import { CanchasModule } from './canchas/canchas.module';

@Module({
  imports: [ReservasModule, ClientesModule, CanchasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}