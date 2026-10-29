import { User } from '../../domain/entities/user';

export interface AuthUserViewModel {
    readonly id: number;
    readonly displayName: string;
    readonly email: string;
    readonly initials: string; // Para el avatar del Header: "Ana Pérez" -> "AP"
}

export class AuthViewModelMapper {
    static toViewModel(entity: User): AuthUserViewModel {
        const initials = entity.name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join('');

        return {
            id: entity.id,
            displayName: entity.name,
            email: entity.email,
            initials,
        };
    }
}
