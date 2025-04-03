import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    console.log('validateUser called with email:', email);
    console.log('validateUser result:', user);
    if (user) {
      console.log(password,user.password)
      if (password === user.password) {
        console.log('Password match');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log('Password match');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pass, ...result } = user;
        return result;
      }
      console.log('Password does not match');
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    console.log('inside post login ***********');
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(
      resetPasswordDto.currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }
}
