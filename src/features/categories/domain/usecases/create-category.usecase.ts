import { Category, validateCategoryFields } from '../entities/category';
import { CategoryRepository, CreateCategoryParams } from '../repositories/category.repository';

export class CreateCategoryUseCase {
    constructor(private readonly repository: CategoryRepository) { }

    async execute(params: CreateCategoryParams): Promise<Category> {
        validateCategoryFields(params.name, params.color);

        const name = params.name.trim();
        const existing = await this.repository.getAll();
        const isDuplicated = existing.some((c) => c.name.toLowerCase() === name.toLowerCase());

        if (isDuplicated) {
            throw new Error('Ya existe una categoría con ese nombre.');
        }

        return await this.repository.create({ name, color: params.color });
    }
}
