import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'secret',
    }),
    PrismaModule,
  ],
})
export class AuthModule {}
