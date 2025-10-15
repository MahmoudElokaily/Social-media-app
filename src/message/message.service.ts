import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../conversation/schemas/conversation.schema';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { Message } from './schemas/message.schema';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  async sendMessage(conversationId: string,sendMessageDto: SendMessageDto , currentUser: IUserPayload) {
    const { text , mediaFiles } = sendMessageDto;
    const conversation = await this.conversationService.findOne(conversationId);
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === currentUser._id.toString()
    );
    if (!isParticipant) throw new ForbiddenException('You are not a participant in this conversation');
    const message = new this.messageModel({
      conversation: conversationId,
      sender: currentUser._id,
      text,
      mediaFiles,
      seenBy: [currentUser._id],
    });
    const savedMessage = await message.save();
    await this.conversationService.updateLastMessage(conversationId, savedMessage._id.toString());
    // TODO Real Time
  }

  async getAllMessages(conversationId: string , currentUser: IUserPayload , limit: number , cursor: string) {
    const conversation = await this.conversationService.findOne(conversationId);
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === currentUser._id.toString()
    );
    const query: Record<string, any> =  {
      conversation: conversationId,
      isDeleted: false
    };
    if (cursor) {
      query.createdAt = { $gt: new Date(cursor)}
    }
    const messages = await this.messageModel
      .find(query)
      .sort({ createdAt: 1 })
      .limit(limit + 1)
      .populate([
        { path: 'sender' , select: 'name avatar' },
        { path: 'seenBy' , select: 'name avatar'}
      ]);
    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, limit) : messages;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null,
    };
  }

  async findOne(id: string) {
    const message = await this.messageModel.findOne({ _id: id , isDeleted: false });
    if (!message) throw new NotFoundException('No message found.');
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto , currentUser: IUserPayload) {
    const {text , mediaFiles} = updateMessageDto;
    const message = await this.findOne(id);
    if (message.sender._id.toString() !== currentUser._id) throw new ForbiddenException();
    message.text = text || message.text;
    message.mediaFiles = mediaFiles || message.mediaFiles;
    await message.save();
  }

  async remove(id: string , currentUser: IUserPayload) {
    const message = await this.findOne(id);
    if (message.sender._id.toString() !== currentUser._id) throw new ForbiddenException();
    message.isDeleted = true;
    await message.save();
  }

  async markSeenMessage(id: string , currentUser: IUserPayload) {
    const message = await this.findOne(id);
    const user = await this.userService.findOne(currentUser._id);

    const alreadySeen = message.seenBy.some(u => u?.toString() === currentUser._id);

    if (!alreadySeen) {
      message.seenBy.push(user);
      await message.save();
    }
  }

}
