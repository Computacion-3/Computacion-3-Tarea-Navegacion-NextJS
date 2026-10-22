import { {{EntityName}}MockDatasource } from '../infrastructure/datasources/{{entity-slug}}-mock-datasource';
import { {{EntityName}}RepositoryImpl } from '../infrastructure/repositories/{{entity-slug}}.repository.impl';
import { Get{{EntityNamePlural}}UseCase } from '../domain/usecases/get-{{entity-slug-plural}}.usecase';
import { Create{{EntityName}}UseCase } from '../domain/usecases/create-{{entity-slug}}.usecase';

const datasource = new {{EntityName}}MockDatasource();
const {{entityCamelCase}}Repository = new {{EntityName}}RepositoryImpl(datasource);

export const {{entityCamelCase}}Container = {
    get{{EntityNamePlural}}: new Get{{EntityNamePlural}}UseCase({{entityCamelCase}}Repository),
    create{{EntityName}}: new Create{{EntityName}}UseCase({{entityCamelCase}}Repository),
};

export type {{EntityName}}Container = typeof {{entityCamelCase}}Container;
