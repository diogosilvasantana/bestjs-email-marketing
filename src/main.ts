import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws'; // Importe o WsAdapter

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adicione o adaptador WebSocket ao aplicativo
  app.useWebSocketAdapter(new WsAdapter(app));

  // Adicione qualquer lógica de inicialização aqui
  // Por exemplo, você pode começar a ouvir a fila aqui
  const logger = new Logger('Main');
  const port = 3000;

  await app.listen(port, () => {
    logger.log(`Application is running on port ${port}`);
  });
}
bootstrap();
