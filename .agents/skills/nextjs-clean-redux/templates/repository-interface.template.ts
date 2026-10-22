import { {{EntityName}} } from '../entities/{{entity-slug}}';

export interface Create{{EntityName}}Params {
    name: string;
    description?: string;
}

export interface {{EntityName}}Repository {
    getAll(): Promise<{{EntityName}}[]>;
    getById(id: number): Promise<{{EntityName}} | null>;
    create(params: Create{{EntityName}}Params): Promise<{{EntityName}}>;
}
