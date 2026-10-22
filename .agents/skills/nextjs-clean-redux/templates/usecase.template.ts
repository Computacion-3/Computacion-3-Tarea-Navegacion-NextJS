import { {{EntityName}} } from '../entities/{{entity-slug}}';
import { {{EntityName}}Repository } from '../repositories/{{entity-slug}}.repository';

export class Get{{EntityNamePlural}}UseCase {
    constructor(private readonly repository: {{EntityName}}Repository) {}

    async execute(): Promise<{{EntityName}}[]> {
        const items = await this.repository.getAll();
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }
}
