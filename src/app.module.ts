import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { CanchasModule } from './canchas/canchas.module';

@Module({
  imports: [ClientesModule, CanchasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
