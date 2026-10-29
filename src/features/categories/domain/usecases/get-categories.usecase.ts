import { Category } from '../entities/category';
import { CategoryRepository } from '../repositories/category.repository';

export class GetCategoriesUseCase {
    constructor(private readonly repository: CategoryRepository) { }

    async execute(): Promise<Category[]> {
        const categories = await this.repository.getAll();
        return [...categories].sort((a, b) => a.name.localeCompare(b.name));
    }
}
