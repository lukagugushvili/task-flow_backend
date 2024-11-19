import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUpdateTaskRes } from 'src/interfaces/update.inter';
import { IDeleteTaskRes } from 'src/interfaces/delete.inter';
import { ObjectId } from 'src/types/objectTypes';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly userService: UsersService,
  ) {}

  // create a new task for a specific user
  async createTask(
    createTaskDto: CreateTaskDto,
    userId: ObjectId,
  ): Promise<Task> {
    try {
      const user = await this.userService.getByWithId(userId);

      if (!user) throw new NotFoundException('User not found');

      const newTask = await this.taskModel.create({
        ...createTaskDto,
        user: userId,
      });

      await this.userService.addTaskToUser(userId, newTask.id);

      const populatedTask = await this.taskModel
        .findById(newTask._id)
        .populate('user');

      return populatedTask;
    } catch (error) {
      console.error('Error creating task: ', error.message);
      throw new BadRequestException('Could not create task');
    }
  }

  // return all tasks for a specific user
  async findAll(userId: string): Promise<Task[]> {
    const objectUserId = new Types.ObjectId(userId);
    try {
      const tasks = await this.taskModel
        .find({ user: objectUserId })
        .select('-__v')
        .lean();

      if (!tasks) throw new NotFoundException('Tasks not found');

      return tasks as Task[];
    } catch (error) {
      console.error('Error fetching Tasks: ', error.message);
      throw new NotFoundException('Could not found Tasks');
    }
  }

  //Retrieve a single task by its ID, ensuring it belongs to the user.
  async findTaskById(taskId: string, userId: string): Promise<Task> {
    const objectTaskId = new Types.ObjectId(taskId);
    const objectUserId = new Types.ObjectId(userId);
    try {
      const task = await this.taskModel.findById({
        _id: objectTaskId,
        user: objectUserId,
      });

      if (!task) throw new NotFoundException('Task not found');

      return task;
    } catch (error) {
      console.error('Error fetching Task: ', error.message);
      throw new NotFoundException('Could not fetch Task');
    }
  }

  // Update a task, ensuring it belongs to the user.
  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<IUpdateTaskRes> {
    const objectTaskId = new Types.ObjectId(taskId);
    const objectUserId = new Types.ObjectId(userId);
    try {
      const updatedTask = await this.taskModel.findOneAndUpdate(
        { _id: objectTaskId, user: objectUserId },
        updateTaskDto,
        { new: true },
      );

      if (!updatedTask) {
        throw new NotFoundException('Task not found or not authorized');
      }

      return {
        success: true,
        message: 'Task updated successfully',
        task: updatedTask,
      };
    } catch (error) {
      console.error('Error updating task: ', error.message);
      throw new BadRequestException('Could not update Task');
    }
  }

  // Delete a task, ensuring it belongs to the user.
  async removeTask(taskId: string, userId: string): Promise<IDeleteTaskRes> {
    const objectTaskId = new Types.ObjectId(taskId);
    const objectUserId = new Types.ObjectId(userId);

    try {
      const removeTask = await this.taskModel.findOneAndDelete({
        _id: objectTaskId,
        user: objectUserId,
      });

      if (!removeTask) {
        throw new NotFoundException('Task not found or not authorized');
      }

      return {
        success: true,
        message: 'Task deleted successfully',
        task: removeTask,
      };
    } catch (error) {
      console.error('Error can not remove task: ', error.message);
      throw new BadRequestException('Could not deleted Task');
    }
  }
}
