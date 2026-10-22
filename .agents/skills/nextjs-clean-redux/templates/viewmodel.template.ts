import { {{EntityName}} } from '../../domain/entities/{{entity-slug}}';

export interface {{EntityName}}ItemViewModel {
    readonly id: number;
    readonly title: string;
    readonly descriptionText: string;
    readonly formattedDate: string;
    readonly isRecent: boolean;
    readonly badgeText: string;
}

export class {{EntityName}}ViewModelMapper {
    static toViewModel(entity: {{EntityName}}): {{EntityName}}ItemViewModel {
        const twoDaysInMs = 1000 * 60 * 60 * 24 * 2;
        const isRecent = Date.now() - entity.createdAt.getTime() <= twoDaysInMs;

        return {
            id: entity.id,
            title: entity.name,
            descriptionText: entity.hasDescription()
                ? entity.description!
                : 'No description provided.',
            formattedDate: entity.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            isRecent,
            badgeText: isRecent ? 'Recent' : `ID #${entity.id}`,
        };
    }
}
