import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/replace-partial-user.dto';
import { ReplaceUserDTO } from './dto/replace-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ name, email, password }: CreateUserDTO) {
    return await this.prismaService.user.create({
      data: { name, email, password },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    await this.verifyIdExists(id);
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, { name, email, password }: ReplaceUserDTO) {
    await this.verifyIdExists(id);
    const user = await this.prismaService.user.update({ where: { id: id }, data: { name, email, password } });
    return user;
  }

  async updatePartial(id: number, userData: UpdateUserDTO) {
    await this.verifyIdExists(id);
    const user = await this.prismaService.user.update({ where: { id: id }, data: userData });
    return user;
  }

  async delete(id: number) {
    await this.verifyIdExists(id);
    return await this.prismaService.user.delete({ where: { id: id } });
  }

  async verifyIdExists(id: number) {
    const idCondition = await this.prismaService.user.count({ where: { id } });
    if (!idCondition) {
      throw new NotFoundException(`User com o id ${id} não encontrado`);
    }
  }
}
