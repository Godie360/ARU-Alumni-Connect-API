// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GetUser } from './get-user.decorator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new alumni user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Alumni registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  register(@Body() registerDto: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to get access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register-admin')
  @ApiTags('admin')
  @ApiOperation({ summary: 'Register a new admin user (Admin only)' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Require admin privileges',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  registerAdmin(
    @Body() registerDto: RegisterDto,
    // @GetUser() user: User, // Current admin user
  ): Promise<{ accessToken: string }> {
    return this.authService.createAdmin(registerDto);
  }

  @Post('setup-admin')
  @ApiTags('auth')
  @ApiOperation({ summary: 'Setup the first admin user (require setup code)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'enosh@gmail.com' },
        password: { type: 'string', example: 'passwordgODY222' },
        firstName: { type: 'string', example: 'Admin' },
        lastName: { type: 'string', example: 'User' },
        graduationYear: { type: 'number', example: 2024 },
        setupCode: { type: 'string', example: 'admin-setup-code' },
      },
      required: ['email', 'password', 'firstName', 'lastName', 'setupCode'],
    },
  })
  @ApiResponse({ status: 201, description: 'Admin setup successful' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid setup code',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Admin user already exists',
  })
  async setupAdmin(
    @Body() registerDto: RegisterDto,
    @Body('setupCode') setupCode: string,
  ): Promise<{ accessToken: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const validSetupCode = this.configService.get('ADMIN_SETUP_CODE');

    if (!validSetupCode || setupCode !== validSetupCode) {
      throw new UnauthorizedException('Invalid setup code');
    }

    // Check if admin already exists
    const existingAdmin = await this.authService.findUserByRole(UserRole.ADMIN);
    if (existingAdmin) {
      throw new ConflictException(
        'Admin user already exists. Use the register-admin endpoint instead.',
      );
    }

    return this.authService.createAdmin(registerDto);
  }
}
