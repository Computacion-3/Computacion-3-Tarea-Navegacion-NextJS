import { {{EntityName}} } from '../../domain/entities/{{entity-slug}}';
import { Create{{EntityName}}Params, {{EntityName}}Repository } from '../../domain/repositories/{{entity-slug}}.repository';
import { {{EntityName}}Datasource } from '../datasources/{{entity-slug}}-datasource.interface';
import { {{EntityName}}Mapper } from '../mappers/{{entity-slug}}.mapper';

export class {{EntityName}}RepositoryImpl implements {{EntityName}}Repository {
    constructor(private readonly datasource: {{EntityName}}Datasource) {}

    async getAll(): Promise<{{EntityName}}[]> {
        const dtos = await this.datasource.fetchAll();
        return dtos.map((dto) => {{EntityName}}Mapper.toDomain(dto));
    }

    async getById(id: number): Promise<{{EntityName}} | null> {
        const dto = await this.datasource.fetchById(id);
        return dto ? {{EntityName}}Mapper.toDomain(dto) : null;
    }

    async create(params: Create{{EntityName}}Params): Promise<{{EntityName}}> {
        const dtoToSend = {{EntityName}}Mapper.toDto(params);
        const createdDto = await this.datasource.create(dtoToSend);
        return {{EntityName}}Mapper.toDomain(createdDto);
    }
}
