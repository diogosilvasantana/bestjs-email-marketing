import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ProgressGateway {
  @WebSocketServer()
  server: Server;

  sendProgressUpdate(current: number, total: number, message: string): void {
    try {
      if (this.server) {
        this.server.emit('progress', { current, total, message });
      } else {
        console.error('WebSocket server is not available.');
      }
    } catch (error) {
      console.error('Error sending progress:', error);
    }
  }
}
