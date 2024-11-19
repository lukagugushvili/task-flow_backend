import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './schema/task.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUpdateTaskRes } from 'src/interfaces/update.inter';
import { IDeleteTaskRes } from 'src/interfaces/delete.inter';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req): Promise<Task[]> {
    return this.taskService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findTaskById(@Param('id') id: string, @Request() req): Promise<Task> {
    return this.taskService.findTaskById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ): Promise<IUpdateTaskRes> {
    return this.taskService.updateTask(id, updateTaskDto, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async removeTask(
    @Param('id') id: string,
    @Request() req,
  ): Promise<IDeleteTaskRes> {
    return this.taskService.removeTask(id, req.user.id);
  }
}
