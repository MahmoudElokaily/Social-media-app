import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ReactionNotificationDto } from './dto/response-notification.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  handleNotificationCreate(receiverId:string , data: ReactionNotificationDto) {
    this.server.to(receiverId).emit('notification_created' , data);
  }
}
