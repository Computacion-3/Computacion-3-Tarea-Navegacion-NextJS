import {
    normalizeEmail,
    validateEmail,
    validateFullName,
    validatePassword,
} from '../entities/credentials';
import { User } from '../entities/user';
import { AuthRepository, RegisterParams } from '../repositories/auth.repository';

export class RegisterUserUseCase {
    constructor(private readonly repository: AuthRepository) { }

    async execute(params: RegisterParams): Promise<User> {
        validateFullName(params.name);
        validateEmail(params.email);
        validatePassword(params.password);

        return await this.repository.register({
            name: params.name.trim(),
            email: normalizeEmail(params.email),
            password: params.password,
        });
    }
}
