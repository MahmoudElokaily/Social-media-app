import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponsePostDto } from './dto/response-post.dto';
import { MediaType } from 'express';
import { UploadMediaDto } from '../_cores/dto/upload-media.dto';
import { PostPrivacy } from './enums/post-privacy.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PostGateway {
  @WebSocketServer()
  server: Server;

  handlePostCreate(data: ResponsePostDto) {
    this.server.emit('post_created' , data);
  }

  handleUploadMedia(postId: string, uploadMediaDto: UploadMediaDto[]) {
    this.server.emit('post_upload_media' , {postId , mediaFiles: uploadMediaDto});
  }

  handleRemoveMedia(postId: string, mediaId: string) {
    this.server.emit('post_remove_media' , {
      postId,
      mediaId
    })
  }

  handlePostUpdate(data: { postId: string , backgroundColor: string, content: string , privacy: PostPrivacy }) {
    this.server.emit('post_updated' , data);
  }

  handleRemovePost(postId: string) {
    this.server.emit('post_deleted' , postId);
  }
}
