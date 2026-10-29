import { CategoryDatasource } from './category-datasource.interface';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class CategoryMockDatasource implements CategoryDatasource {
    private categories: CategoryResponseDto[] = [
        { id: 1, name: 'Fuerza', color: '#4f2de0' },
        { id: 2, name: 'Hipertrofia', color: '#ec2f8f' },
        { id: 3, name: 'Resistencia', color: '#14c9a8' },
    ];

    async fetchCategories(): Promise<CategoryResponseDto[]> {
        await delay(400);
        return this.categories.map((c) => ({ ...c }));
    }

    async fetchCategoryById(id: number): Promise<CategoryResponseDto | null> {
        await delay(200);
        const found = this.categories.find((c) => c.id === id);
        return found ? { ...found } : null;
    }

    async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        await delay(500);
        const nextId = this.categories.length > 0
            ? Math.max(...this.categories.map((c) => c.id)) + 1
            : 1;

        const created: CategoryResponseDto = { id: nextId, name: dto.name, color: dto.color };
        this.categories.push(created);
        return { ...created };
    }

    async updateCategory(dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        await delay(500);
        const index = this.categories.findIndex((c) => c.id === dto.id);
        if (index === -1) {
            throw new Error('La categoría no existe.');
        }

        this.categories[index] = { id: dto.id, name: dto.name, color: dto.color };
        return { ...this.categories[index] };
    }

    async deleteCategory(id: number): Promise<void> {
        await delay(500);
        this.categories = this.categories.filter((c) => c.id !== id);
    }
}
