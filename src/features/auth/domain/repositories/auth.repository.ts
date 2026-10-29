import { User } from '../entities/user';

export interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

export interface LoginParams {
    email: string;
    password: string;
}

export interface AuthRepository {
    /** Crea la cuenta e inicia sesión con ella. */
    register(params: RegisterParams): Promise<User>;

    login(params: LoginParams): Promise<User>;

    logout(): Promise<void>;

    /** Usuario de la sesión activa, o null si no hay sesión. */
    getCurrentUser(): Promise<User | null>;
}
