import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ProgressGateway {
  @WebSocketServer()
  server: Server;

  sendProgressUpdate(progress: any): void {
    try {
      if (this.server) {
        console.log(progress);
        console.log(this.server);
        this.server.emit('progress', progress);
      } else {
        console.error('WebSocket server is not available.');
      }
    } catch (error) {
      console.error('Error sending progress:', error);
    }
  }
}
