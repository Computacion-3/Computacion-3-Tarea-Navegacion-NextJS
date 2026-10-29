import { Category, validateCategoryFields } from '../entities/category';
import { CategoryRepository, UpdateCategoryParams } from '../repositories/category.repository';

export class UpdateCategoryUseCase {
    constructor(private readonly repository: CategoryRepository) { }

    async execute(params: UpdateCategoryParams): Promise<Category> {
        validateCategoryFields(params.name, params.color);

        const current = await this.repository.getById(params.id);
        if (!current) {
            throw new Error('La categoría que intentas editar no existe.');
        }

        const name = params.name.trim();
        const existing = await this.repository.getAll();
        const isDuplicated = existing.some(
            (c) => c.id !== params.id && c.name.toLowerCase() === name.toLowerCase(),
        );

        if (isDuplicated) {
            throw new Error('Ya existe una categoría con ese nombre.');
        }

        return await this.repository.update({ id: params.id, name, color: params.color });
    }
}
