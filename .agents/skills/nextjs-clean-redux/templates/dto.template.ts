export interface {{EntityName}}ResponseDto {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

export interface Create{{EntityName}}Dto {
    name: string;
    description?: string;
    userId?: number;
}
