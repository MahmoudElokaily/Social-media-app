import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';
import { MediaType } from '../../_cores/dto/media-type.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop()
  name: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop()
  password: string;
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @Prop()
  bio?: string;
  @Prop()
  avatar?: MediaType;
  @Prop()
  coverPhoto?: MediaType;
  @Prop()
  birthdate?: Date;
  @Prop()
  phoneNumber?: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' , default: [] })
  friends: UserDocument[];
  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
