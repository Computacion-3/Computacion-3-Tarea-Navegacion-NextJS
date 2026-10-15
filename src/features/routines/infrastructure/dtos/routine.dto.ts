export interface RoutineResponseDto {
    id: number;
    name: string;
    description?: string;
}

export interface CreateRoutineDto {
    name: string;
    description?: string;
    userId: number
}