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
import { UserIdParamDto } from './dto/user-id-param.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IDeleteUser } from 'src/interfaces/delete-user.inter';
import { IUpdateUser } from 'src/interfaces/update-user.inter';

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
  async getByWithId(@Param() userIdParamDto: UserIdParamDto): Promise<User> {
    return this.usersService.getByWithId(userIdParamDto);
  }

  @Put(':id')
  async updateUser(
    @Param() userIdParamDto: UserIdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUpdateUser> {
    return this.usersService.updateUser(userIdParamDto, updateUserDto);
  }

  @Delete(':id')
  async removeUser(
    @Param() userIdParamDto: UserIdParamDto,
  ): Promise<IDeleteUser> {
    return this.usersService.removeUser(userIdParamDto);
  }
}
