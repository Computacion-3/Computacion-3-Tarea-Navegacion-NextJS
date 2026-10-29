import { AuthRepository } from '../repositories/auth.repository';

export class LogoutUserUseCase {
    constructor(private readonly repository: AuthRepository) { }

    async execute(): Promise<void> {
        await this.repository.logout();
    }
}
