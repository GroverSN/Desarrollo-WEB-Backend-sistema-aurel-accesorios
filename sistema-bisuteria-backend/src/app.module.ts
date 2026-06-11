import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { ReportesModule } from './reportes/reportes.module';
import { ConsultasModule } from './consultas/consultas.module';
import { UploadModule } from './upload/upload.module';
import { Usuario, Producto, Categoria, Imagen, Venta, DetalleVenta, LogAcceso, Consulta } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [Usuario, Producto, Categoria, Imagen, Venta, DetalleVenta, LogAcceso, Consulta],
        synchronize: true,
      }),
    }),
    AuthModule,
    CategoriasModule,
    ProductosModule,
    VentasModule,
    ReportesModule,
    ConsultasModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}