import { {{EntityName}}Datasource } from './{{entity-slug}}-datasource.interface';
import { {{EntityName}}ResponseDto, Create{{EntityName}}Dto } from '../dtos/{{entity-slug}}.dto';

export class {{EntityName}}MockDatasource implements {{EntityName}}Datasource {
    private items: {{EntityName}}ResponseDto[] = [
        {
            id: 1,
            name: 'Initial {{EntityName}}',
            description: 'Sample initial test record',
            created_at: new Date().toISOString(),
        },
    ];

    async fetchAll(): Promise<{{EntityName}}ResponseDto[]> {
        return [...this.items];
    }

    async fetchById(id: number): Promise<{{EntityName}}ResponseDto | null> {
        const found = this.items.find((item) => item.id === id);
        return found ? { ...found } : null;
    }

    async create(dto: Create{{EntityName}}Dto): Promise<{{EntityName}}ResponseDto> {
        const newItem: {{EntityName}}ResponseDto = {
            id: Date.now(),
            name: dto.name,
            description: dto.description,
            created_at: new Date().toISOString(),
        };
        this.items.push(newItem);
        return newItem;
    }
}
