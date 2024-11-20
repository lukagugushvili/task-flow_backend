import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { TaskPriority } from 'src/types/priorityTypes';
import { TaskStatus } from 'src/types/statusTypes';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  priority: TaskPriority;

  @IsNotEmpty()
  @IsMongoId()
  user: mongoose.Schema.Types.ObjectId;
}
