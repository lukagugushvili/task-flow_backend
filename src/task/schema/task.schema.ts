import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TaskPriority } from 'src/types/priorityTypes';
import { TaskStatus } from 'src/types/statusTypes';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    enum: TaskStatus,
    default: TaskStatus.Pending,
  })
  status: TaskStatus;

  @Prop({
    enum: TaskPriority,
    default: TaskPriority.medium,
  })
  priority: TaskPriority;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task).index({ user: 1 });
