import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return {
      acessToken: this.jwtService.sign(
        {
          sub: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        {
          expiresIn: '7 days',
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const validation = this.jwtService.verify(token, {
        issuer: 'login',
        audience: 'users',
      });

      return validation;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    //console.log(process.env);
    // Busca apenas pelo email
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    // Se não achou o usuário, lança exceção
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Compara a senha fornecida com a senha hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password); // ou user.hashedPassword

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Gera o token normalmente
    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email incorreto');
    }

    // TODO: enviar o email....

    return true;
  }

  async reset(password: string, token: string) {
    // 1. Validar o token JWT
    let payload;
    try {
      payload = this.jwtService.verify(token, {
        issuer: 'login',
        audience: 'users',
      });
    } catch (err) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // 2. Extrair id do usuário do payload
    const userId = payload.sub;
    if (!userId) {
      throw new BadRequestException('Token inválido');
    }

    // 3. Gerar hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Atualizar senha no banco
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword }, // ou hashedPassword se seu campo for esse
    });

    // 5. Retornar um novo token (opcional, para já autenticar o usuário)
    return this.createToken(user);
  }

  async register(registerUser: AuthRegisterDTO) {
    const user = await this.userService.create(registerUser);

    return this.createToken(user);
  }
}
