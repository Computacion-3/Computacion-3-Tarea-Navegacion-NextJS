import { Routine } from '../../domain/entities/routine';

export interface RoutineItemViewModel {
    readonly id: number;
    readonly title: string;
    readonly descriptionText: string;
    readonly formattedDate: string;
    readonly categoryId: number;
}

export class RoutineViewModelMapper {
    static toViewModel(entity: Routine): RoutineItemViewModel {
        return {
            id: entity.id,
            title: entity.name,
            descriptionText: entity.hasDescription()
                ? entity.description!
                : 'Sin descripción asignada.',
            formattedDate: entity.createdAt.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            categoryId: entity.categoryId,
        };
    }
}
