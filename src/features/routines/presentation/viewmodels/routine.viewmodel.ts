import { Routine } from '../../domain/entities/routine';

export interface RoutineItemViewModel {
    readonly id: number;
    readonly title: string;
    readonly descriptionText: string;
    readonly rawDescription?: string;
    readonly formattedDate: string;
    readonly isRecent: boolean;
    readonly badgeText: string;
}

export class RoutineViewModelMapper {
    static toViewModel(entity: Routine): RoutineItemViewModel {
        // Regla de presentación: una rutina es reciente si tiene menos de 2 días de creada
        const twoDaysInMs = 1000 * 60 * 60 * 24 * 2;
        const isRecent = Date.now() - entity.createdAt.getTime() <= twoDaysInMs;

        return {
            id: entity.id,
            title: entity.name,
            descriptionText: entity.hasDescription()
                ? entity.description!
                : 'Sin descripción asignada.',
            rawDescription: entity.description,
            formattedDate: entity.createdAt.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            isRecent,
            badgeText: isRecent ? 'Reciente' : `ID #${entity.id}`,
        };
    }
}
