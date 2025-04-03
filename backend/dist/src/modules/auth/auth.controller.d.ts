import { AuthService } from './auth.service';
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
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(user: UserEntity): import("../users/entities/user.entity").User;
}
export {};
