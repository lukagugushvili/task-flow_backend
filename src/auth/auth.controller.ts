import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { ISignInUser } from 'src/interfaces/signIn-user.inter';
import { IRegisterUser } from 'src/interfaces/register-user.inter';
import { IProtectData, IReqUser } from 'src/interfaces/req-user.inter';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<IRegisterUser> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async logIn(@Body() logInDto: LogInDto): Promise<ISignInUser> {
    return this.authService.logIn(logInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  async protectedData(@Request() req: IReqUser): Promise<IProtectData> {
    const { userId, userName, email } = req.user;
    return {
      message: 'This is a protected route',
      user: { userId, userName, email },
    };
  }
}
