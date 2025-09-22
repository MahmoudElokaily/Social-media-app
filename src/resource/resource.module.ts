import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../post/schemas/post.schema';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema} , {name: Post.name, schema: PostSchema}]),
  ],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
