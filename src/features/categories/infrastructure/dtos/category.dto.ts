export interface CategoryResponseDto {
    id: number;
    name: string;
    color: string;
}

export interface CreateCategoryDto {
    name: string;
    color: string;
}

export interface UpdateCategoryDto {
    id: number;
    name: string;
    color: string;
}
