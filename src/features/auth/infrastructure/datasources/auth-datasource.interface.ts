import { LoginDto, RegisterDto, UserResponseDto } from '../dtos/auth.dto';

export interface AuthDatasource {
    register(dto: RegisterDto): Promise<UserResponseDto>;
    login(dto: LoginDto): Promise<UserResponseDto>;
    logout(): Promise<void>;
    fetchCurrentUser(): Promise<UserResponseDto | null>;
}
