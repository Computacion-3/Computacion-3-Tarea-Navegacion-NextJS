import { normalizeEmail, validateEmail } from '../entities/credentials';
import { User } from '../entities/user';
import { AuthRepository, LoginParams } from '../repositories/auth.repository';

export class LoginUserUseCase {
    constructor(private readonly repository: AuthRepository) { }

    async execute(params: LoginParams): Promise<User> {
        validateEmail(params.email);

        if (!params.password) {
            throw new Error('Ingresa tu contraseña.');
        }

        return await this.repository.login({
            email: normalizeEmail(params.email),
            password: params.password,
        });
    }
}
