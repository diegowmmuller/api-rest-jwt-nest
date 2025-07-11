import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserIdCheckMiddleware } from 'src/middleware/user-id-check.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL,
    });
  }
}
