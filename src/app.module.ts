import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ResourceModule } from './resource/resource.module';
import { PostModule } from './post/post.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';
import { FriendModule } from './friend/friend.module';
import multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // يحمل .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get<string>('MONGO_USER')}:${configService.get<string>('MONGO_PASS')}@${configService.get<string>('MONGO_HOST')}/${configService.get<string>('MONGO_DB')}?retryWrites=true&w=majority&appName=Cluster0`,
      }),
    }), UserModule, AuthModule, ResourceModule, PostModule, CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(), // ✅ عشان file.buffer يشتغل
    }),
    ReactionModule,
    CommentModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
