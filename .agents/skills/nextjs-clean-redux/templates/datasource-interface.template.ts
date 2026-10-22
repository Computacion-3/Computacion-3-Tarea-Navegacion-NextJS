import { {{EntityName}}ResponseDto, Create{{EntityName}}Dto } from '../dtos/{{entity-slug}}.dto';

export interface {{EntityName}}Datasource {
    fetchAll(): Promise<{{EntityName}}ResponseDto[]>;
    fetchById(id: number): Promise<{{EntityName}}ResponseDto | null>;
    create(dto: Create{{EntityName}}Dto): Promise<{{EntityName}}ResponseDto>;
}
