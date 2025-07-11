import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { ReplaceUserDTO } from './dto/replace-user.dto';
import { UpdateUserDTO } from './dto/replace-partial-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from '../interceptor/log.interceptor';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() user: CreateUserDTO) {
    return await this.userService.create(user);
  }
  @Roles(Role.User, Role.Admin)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }
  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() user: ReplaceUserDTO) {
    return await this.userService.update(id, user);
  }
  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@Param('id', ParseIntPipe) id: number, @Body() partialUser: UpdateUserDTO) {
    return await this.userService.updatePartial(id, partialUser);
  }
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
