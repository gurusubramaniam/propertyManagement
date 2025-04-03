import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEntity } from '../users/entities/user.entity';
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
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<Omit<UserEntity, 'password'> | null>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
export {};
