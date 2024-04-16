import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

class MySocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    // Aqui você pode personalizar o servidor Socket.IO conforme necessário
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use o adaptador Socket.IO personalizado
  app.useWebSocketAdapter(new MySocketIoAdapter(app));

  app.enableCors();

  const logger = new Logger('Main');
  const port = 3000;

  await app.listen(port, () => {
    logger.log(`Application is running on port ${port}`);
  });
}
bootstrap();
