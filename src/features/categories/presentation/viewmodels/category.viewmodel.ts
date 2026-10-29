import { Category } from '../../domain/entities/category';

export interface CategoryItemViewModel {
    readonly id: number;
    readonly name: string;
    readonly color: string;
}

export class CategoryViewModelMapper {
    static toViewModel(entity: Category): CategoryItemViewModel {
        return {
            id: entity.id,
            name: entity.name,
            color: entity.color,
        };
    }
}
