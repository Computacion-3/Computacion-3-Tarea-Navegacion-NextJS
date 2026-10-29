export interface RoutineResponseDto {
    id: number;
    name: string;
    description?: string;
    category_id: number;
    created_at: string; // ISO 8601 string
}


export interface CreateRoutineDto {
    name: string;
    description?: string;
    categoryId: number;
    userId?: number;
}
