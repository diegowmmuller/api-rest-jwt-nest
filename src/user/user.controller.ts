import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { ReplaceUserDTO } from './dto/replace-user.dto';
import { UpdateUserDTO } from './dto/replace-partial-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDTO) {
    return await this.userService.create(user);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() user: ReplaceUserDTO) {
    return await this.userService.update(id, user);
  }

  @Patch(':id')
  async updatePartial(@Param('id', ParseIntPipe) id: number, @Body() partialUser: UpdateUserDTO) {
    return await this.userService.updatePartial(id, partialUser);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
