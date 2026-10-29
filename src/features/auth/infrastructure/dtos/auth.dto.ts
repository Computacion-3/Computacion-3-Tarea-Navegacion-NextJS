export interface UserResponseDto {
    id: number;
    name: string;
    email: string;
    created_at: string; // ISO 8601 string
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
