import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  register(registerAuthDto: RegisterAuthDto) {
    return `This action registers the user ${registerAuthDto.email}`;
  }

  login(loginAuthDto: LoginAuthDto) {
    return `This action logs in the user ${loginAuthDto.email}`;
  }
}
