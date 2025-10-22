import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '../_cores/globals/enum';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../comment/schemas/comment.schema';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { transformDto } from '../_cores/utills/transorm-dto.utils';
import { ReactionNotificationDto } from './dto/response-notification.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private notificationGateway: NotificationGateway,
  ) {
  }
  async create(senderId: string, receiverId: string , type: NotificationType, content: string, linkToId?: string) {
    const notification = new this.notificationModel({
      sender: senderId,
      receiver: receiverId,
      type,
      content,
      linkToId,
    })
    const savedNotification = await notification.save();
    const populateNotification = await this.findOne(savedNotification._id.toString());
    const responseNotificationDto = transformDto(ReactionNotificationDto , populateNotification);
    this.notificationGateway.handleNotificationCreate(receiverId , responseNotificationDto);
    return savedNotification;
  }

  async findAll(currentUser: IUserPayload,limit: number , cursor: string) {
    const query: Record<string, any> = {receiver: currentUser._id};
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }
    const notifications = await this.notificationModel.find(query)
      .populate('sender' , 'name avatar')
      .limit(limit + 1)
      .sort({ createdAt: -1 });

    const hasNextPage = notifications.length > limit;
    const items = hasNextPage ? notifications.slice(0, limit) : notifications;
    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null,
    }
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id).populate('sender' , 'name avatar');
    if (!notification) throw new NotFoundException("Notification not found!");
    return notification;
  }

  async markAsRead(id: string) {
    const notification = await this.findOne(id);
    notification.isRead = true;
    await notification.save();
  }

  async markAllRead(currentUser: IUserPayload) {
    await this.notificationModel.updateMany({receiver: currentUser._id , is_read: false},
      {
        isRead: true,
      },
    );
  }
}
