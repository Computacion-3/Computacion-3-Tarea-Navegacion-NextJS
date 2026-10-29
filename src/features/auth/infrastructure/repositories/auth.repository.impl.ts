import { User } from '../../domain/entities/user';
import {
    AuthRepository,
    LoginParams,
    RegisterParams,
} from '../../domain/repositories/auth.repository';
import { AuthDatasource } from '../datasources/auth-datasource.interface';
import { AuthMapper } from '../mappers/auth.mapper';

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private readonly datasource: AuthDatasource) { }

    async register(params: RegisterParams): Promise<User> {
        const dto = await this.datasource.register(AuthMapper.toRegisterDto(params));
        return AuthMapper.toDomain(dto);
    }

    async login(params: LoginParams): Promise<User> {
        const dto = await this.datasource.login(AuthMapper.toLoginDto(params));
        return AuthMapper.toDomain(dto);
    }

    async logout(): Promise<void> {
        await this.datasource.logout();
    }

    async getCurrentUser(): Promise<User | null> {
        const dto = await this.datasource.fetchCurrentUser();
        return dto ? AuthMapper.toDomain(dto) : null;
    }
}
