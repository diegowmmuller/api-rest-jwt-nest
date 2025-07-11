import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/enum/role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}
