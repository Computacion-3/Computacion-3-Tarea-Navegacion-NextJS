import { User } from '../entities/user';
import { AuthRepository } from '../repositories/auth.repository';

export class GetCurrentUserUseCase {
    constructor(private readonly repository: AuthRepository) { }

    async execute(): Promise<User | null> {
        return await this.repository.getCurrentUser();
    }
}
