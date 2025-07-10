import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { ReplaceUserDTO } from './dto/replace-user.dto';
import { UpdateUserDTO } from './dto/replace-partial-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return { body };
  }

  @Get()
  async findAll() {
    return { users: [] };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { id, user: {} };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: ReplaceUserDTO) {
    return { id, body };
  }

  @Patch(':id')
  async updatePartial(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
    return { id, body };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return null;
  }
}
