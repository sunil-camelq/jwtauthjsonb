import { Controller, Post, Body, Get, Headers, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('manager', 'team_lead', 'employee')
  getUsersBasedOnRole(@Request() req: any) {
    return this.authService.getUsersBasedOnRole(req.user);
  }
}
