import { AuthDatasource } from './auth-datasource.interface';
import { LoginDto, RegisterDto, UserResponseDto } from '../dtos/auth.dto';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USERS_KEY = 'gymroutines.mock.users';
const SESSION_KEY = 'gymroutines.mock.session';

// Solo para el mock: el backend real guarda un hash, nunca la contraseña en claro.
interface StoredUser extends UserResponseDto {
    password: string;
}

const SEED_USERS: StoredUser[] = [
    {
        id: 1,
        name: 'Ana Pérez',
        email: 'ana@gymroutines.com',
        password: 'Demo1234',
        created_at: new Date('2026-10-01T12:00:00Z').toISOString(),
    },
];

// localStorage con respaldo en memoria (SSR o almacenamiento bloqueado)
const memory = new Map<string, string>();

function readRaw(key: string): string | null {
    try {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem(key);
        }
    } catch {
        // cae al respaldo en memoria
    }
    return memory.get(key) ?? null;
}

function writeRaw(key: string, value: string | null): void {
    try {
        if (typeof window !== 'undefined') {
            if (value === null) window.localStorage.removeItem(key);
            else window.localStorage.setItem(key, value);
            return;
        }
    } catch {
        // cae al respaldo en memoria
    }
    if (value === null) memory.delete(key);
    else memory.set(key, value);
}

function loadUsers(): StoredUser[] {
    const raw = readRaw(USERS_KEY);
    if (!raw) return [...SEED_USERS];
    try {
        return JSON.parse(raw) as StoredUser[];
    } catch {
        return [...SEED_USERS];
    }
}

const saveUsers = (users: StoredUser[]) => writeRaw(USERS_KEY, JSON.stringify(users));

const toPublic = ({ password: _password, ...user }: StoredUser): UserResponseDto => user;

export class AuthMockDatasource implements AuthDatasource {
    async register(dto: RegisterDto): Promise<UserResponseDto> {
        await delay(800);
        const users = loadUsers();

        if (users.some((u) => u.email === dto.email)) {
            throw new Error('Ya existe una cuenta con ese correo.');
        }

        const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const created: StoredUser = {
            id: nextId,
            name: dto.name,
            email: dto.email,
            password: dto.password,
            created_at: new Date().toISOString(),
        };

        saveUsers([...users, created]);
        writeRaw(SESSION_KEY, String(created.id));
        return toPublic(created);
    }

    async login(dto: LoginDto): Promise<UserResponseDto> {
        await delay(600);
        const found = loadUsers().find((u) => u.email === dto.email && u.password === dto.password);

        if (!found) {
            throw new Error('Correo o contraseña incorrectos.');
        }

        writeRaw(SESSION_KEY, String(found.id));
        return toPublic(found);
    }

    async logout(): Promise<void> {
        await delay(200);
        writeRaw(SESSION_KEY, null);
    }

    async fetchCurrentUser(): Promise<UserResponseDto | null> {
        await delay(300);
        const sessionId = readRaw(SESSION_KEY);
        if (!sessionId) return null;

        const found = loadUsers().find((u) => u.id === Number(sessionId));
        return found ? toPublic(found) : null;
    }
}
