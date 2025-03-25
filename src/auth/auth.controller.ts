// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { GetUser } from './get-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register-admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  registerAdmin(
    @Body() registerDto: RegisterDto,
    @GetUser() user: User, // Current admin user
  ): Promise<{ accessToken: string }> {
    return this.authService.createAdmin(registerDto);
  }

  @Post('setup-admin')
  async setupAdmin(
    @Body() registerDto: RegisterDto,
    @Body('setupCode') setupCode: string,
  ): Promise<{ accessToken: string }> {
    // Check if the setup code matches the one in environment variables
    const validSetupCode = this.configService.get('ADMIN_SETUP_CODE');
    
    if (!validSetupCode || setupCode !== validSetupCode) {
      throw new UnauthorizedException('Invalid setup code');
    }
    
    // Check if admin already exists
    const existingAdmin = await this.authService.findUserByRole(UserRole.ADMIN);
    if (existingAdmin) {
      throw new ConflictException('Admin user already exists. Use the register-admin endpoint instead.');
    }
    
    return this.authService.createAdmin(registerDto);
  }
}