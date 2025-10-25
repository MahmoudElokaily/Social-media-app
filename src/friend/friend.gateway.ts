import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseFriendRequestDto } from './dto/response-friend-request.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(userId);
  }

  handleSendFriendRequest(recieverId: string, data: ResponseFriendRequestDto) {
    this.server.to(recieverId).emit('send_fiend_request', data);
  }

  handleAcceptRequest(
    senderId: string,
    data: ResponseFriendRequestDto,
    whoEmitEventId: string,
  ) {
    this.server
      .to(senderId).emit('accept_request', data , whoEmitEventId);
  }

  handleRejectRequest(senderId: string, friendRequestId: string,whoEmitEventId: string) {
    this.server.to(senderId).emit('reject_friend_request', friendRequestId , whoEmitEventId);
  }

  handleUnfriend(targetUserId: string , unFriendedId: string) {
    this.server.to(targetUserId).emit('unfriend_request', unFriendedId);
  }

  handleCancelRequest(receiverId : string, senderId: string , friendRequestId: string) {
    this.server
      .to(receiverId)
      .emit('cancel_friend_request', { senderId , friendRequestId });
  }
}
