import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageSchema } from './schemas/message.schema';
import { UserModule } from '../user/user.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
