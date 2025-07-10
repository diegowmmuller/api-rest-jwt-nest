import { Body, Controller, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

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
  async me(@Req() req) {
    return { me: 'ok', data: req.tokenPayload };
  }
}
