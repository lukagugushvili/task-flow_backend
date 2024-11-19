import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { IdParamDto } from './dto/id-param.dto';
import * as bcrypt from 'bcrypt';
import { IUpdateUser } from 'src/interfaces/update.inter';
import { IDeleteUser } from 'src/interfaces/delete.inter';
import { ObjectId } from 'src/types/objectTypes';
import { Task } from 'src/task/schema/task.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      if (!hashedPassword) {
        throw new BadRequestException('Something is wrong with the password');
      }

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException('Could not save user', error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find().populate('tasks');

      if (users.length === 0) {
        throw new NotFoundException('Could not found users');
      }

      return users;
    } catch (error) {
      console.error('Error getting users', error.message);
      throw new BadRequestException('Could not found users', error);
    }
  }

  async getByWithId(id: ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findById(id).populate('tasks');
      return user;
    } catch (error) {
      console.error('Error getting user', error.message);
      throw new BadRequestException('Could not found user', error);
    }
  }

  async updateUser(
    userIdParamDto: IdParamDto,
    updateUserDto: UpdateUserDto,
  ): Promise<IUpdateUser> {
    const { id } = userIdParamDto;
    try {
      const user = await this.userModel.findById(id);

      if (!user) throw new NotFoundException('Could not found user');

      const updateUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );

      return {
        success: true,
        message: 'Updated Successfully',
        user: updateUser,
      };
    } catch (error) {
      console.error('Error update user', error.message);
      throw new BadRequestException('Could not updated user', error);
    }
  }

  async removeUser(userIdParamDto: IdParamDto): Promise<IDeleteUser> {
    const { id } = userIdParamDto;
    try {
      const user = await this.userModel.findById(id);

      if (!user) throw new NotFoundException('Could not found user');

      const removeUser = await this.userModel.findByIdAndDelete(id);

      return {
        success: true,
        message: 'Deleted Successfully',
        user: removeUser,
      };
    } catch (error) {
      console.error('Error remove user', error.message);
      throw new BadRequestException('Could not deleted user', error);
    }
  }

  async addTaskToUser(userId: ObjectId, taskId: ObjectId): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException('User not found');

      user.tasks.push(taskId);
      await user.save();
    } catch (error) {
      console.error('Error adding task to user: ', error.message);
      throw error;
    }
  }

  findFieldsForAuth(email: string) {
    return this.userModel
      .findOne({ email })
      .select(['email', 'password'])
      .exec();
  }

  findFieldsForProfile(email: string) {
    return this.userModel
      .findOne({ email })
      .select(['email', 'id', 'userName'])
      .exec();
  }
}
