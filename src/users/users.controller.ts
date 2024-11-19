import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { IdParamDto } from './dto/id-param.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IDeleteUser } from 'src/interfaces/delete.inter';
import { IUpdateUser } from 'src/interfaces/update.inter';
import { ObjectId } from 'src/types/objectTypes';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getByWithId(@Param('id') id: ObjectId): Promise<User> {
    return this.usersService.getByWithId(id);
  }

  @Put(':id')
  async updateUser(
    @Param() userIdParamDto: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUpdateUser> {
    return this.usersService.updateUser(userIdParamDto, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param() userIdParamDto: IdParamDto): Promise<IDeleteUser> {
    return this.usersService.removeUser(userIdParamDto);
  }
}
