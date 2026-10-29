import { CategoryRepository } from '../repositories/category.repository';

export class DeleteCategoryUseCase {
    constructor(private readonly repository: CategoryRepository) { }

    async execute(id: number): Promise<void> {
        const current = await this.repository.getById(id);
        if (!current) {
            throw new Error('La categoría que intentas eliminar no existe.');
        }

        await this.repository.delete(id);
    }
}
