import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservasModule } from './reservas/reservas.module';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [ReservasModule, ClientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}