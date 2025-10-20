import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server , Socket} from 'socket.io';
import { ResponseMessageDto } from './dto/response-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`Client connected ${client.id}`);
  }
  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(conversationId);
  }

  handleNewMessage(conversationId: string, data: ResponseMessageDto) {
    console.log('Check data from socket ', data);
    this.server.to(conversationId).emit('new_message', data);
  }

  handleUpdateMessage(conversationId: string, data: ResponseMessageDto) {
    console.log('Check data from socket ', data);
    this.server.to(conversationId).emit('update_message', data);
  }

  handleUpdateMessageV2(data: any) {
    console.log('Check data from socket ', data);
    this.server.to(data.conversationId).emit('update_message_v2', data);
  }

  handleRemoveMessage(conversationId: string, messageId: string) {
    this.server.to(conversationId).emit('remove_message', messageId);
  }

  handleSeenMessage(
    conversationId: string,
    messageId: string,
    seenBy: { seenById: string , seenByName: string , seenByAvatarUrl: string | undefined },
  ) {
    this.server.to(conversationId).emit('seen_message', { messageId, seenBy });
  }
}
