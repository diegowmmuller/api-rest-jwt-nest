import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUser: AuthRegisterDTO) {
    return this.authService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: AuthLoginDTO) {
    const { email, password } = loginUser;
    return this.authService.login({ email, password });
  }

  @Post('forget')
  async forget(@Body() forgetUser: AuthForgetDTO) {
    const { email } = forgetUser;
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() resetUser: AuthResetDTO) {
    const { password, token } = resetUser;
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { me: 'ok', user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile('file') photo: Express.Multer.File) {
    const result = await writeFile(join(__dirname, '..', '..', 'storage', 'photo', `photo-${user.id}.png`), photo.buffer);

    return { user, result };
  }
}
