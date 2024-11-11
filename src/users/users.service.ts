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
import { Model } from 'mongoose';
import { UserIdParamDto } from './dto/user-id-param.dto';
import * as bcrypt from 'bcrypt';
import { IUpdateUser } from 'src/interfaces/update-user.inter';
import { IDeleteUser } from 'src/interfaces/delete-user.inter';

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
      const users = await this.userModel.find();

      if (users.length === 0) {
        throw new NotFoundException('Could not found users');
      }

      return users;
    } catch (error) {
      console.error('Error getting users', error.message);
      throw new BadRequestException('Could not found users', error);
    }
  }

  async getByWithId(userIdParamDto: UserIdParamDto): Promise<User> {
    const { id } = userIdParamDto;
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (error) {
      console.error('Error getting user', error.message);
      throw new BadRequestException('Could not found user', error);
    }
  }

  async updateUser(
    userIdParamDto: UserIdParamDto,
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

  async removeUser(userIdParamDto: UserIdParamDto): Promise<IDeleteUser> {
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
}
