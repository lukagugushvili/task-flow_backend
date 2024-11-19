import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    minlength: 3,
    max_length: 20,
    trim: true,
  })
  userName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    max_length: 32,
  })
  password: string;

  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: false },
  ])
  tasks: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
