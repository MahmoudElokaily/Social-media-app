import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
  ],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
