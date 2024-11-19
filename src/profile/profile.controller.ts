import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
