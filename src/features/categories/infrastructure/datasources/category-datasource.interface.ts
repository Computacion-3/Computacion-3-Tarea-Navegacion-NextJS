import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

export interface CategoryDatasource {
    fetchCategories(): Promise<CategoryResponseDto[]>;
    fetchCategoryById(id: number): Promise<CategoryResponseDto | null>;
    createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
    updateCategory(dto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    deleteCategory(id: number): Promise<void>;
}
