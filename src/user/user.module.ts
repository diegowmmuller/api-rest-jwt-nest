import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UserController],
  exports: [],
  imports: [PrismaModule],
  providers: [UserService],
})
export class UserModule {}
