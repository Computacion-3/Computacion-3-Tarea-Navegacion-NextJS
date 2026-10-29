import { User } from '../../domain/entities/user';
import { LoginParams, RegisterParams } from '../../domain/repositories/auth.repository';
import { LoginDto, RegisterDto, UserResponseDto } from '../dtos/auth.dto';

export class AuthMapper {
    static toDomain(dto: UserResponseDto): User {
        return new User({
            id: dto.id,
            name: dto.name,
            email: dto.email,
            createdAt: new Date(dto.created_at),
        });
    }

    static toRegisterDto(params: RegisterParams): RegisterDto {
        return {
            name: params.name.trim(),
            email: params.email.trim().toLowerCase(),
            password: params.password,
        };
    }

    static toLoginDto(params: LoginParams): LoginDto {
        return {
            email: params.email.trim().toLowerCase(),
            password: params.password,
        };
    }
}
