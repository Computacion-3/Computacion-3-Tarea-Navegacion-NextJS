import { Category } from '../../domain/entities/category';
import {
    CategoryRepository,
    CreateCategoryParams,
    UpdateCategoryParams,
} from '../../domain/repositories/category.repository';
import { CategoryDatasource } from '../datasources/category-datasource.interface';
import { CategoryMapper } from '../mappers/category.mapper';

export class CategoryRepositoryImpl implements CategoryRepository {
    constructor(private readonly datasource: CategoryDatasource) { }

    async getAll(): Promise<Category[]> {
        const dtos = await this.datasource.fetchCategories();
        return dtos.map((dto) => CategoryMapper.toDomain(dto));
    }

    async getById(id: number): Promise<Category | null> {
        const dto = await this.datasource.fetchCategoryById(id);
        return dto ? CategoryMapper.toDomain(dto) : null;
    }

    async create(params: CreateCategoryParams): Promise<Category> {
        const created = await this.datasource.createCategory(CategoryMapper.toCreateDto(params));
        return CategoryMapper.toDomain(created);
    }

    async update(params: UpdateCategoryParams): Promise<Category> {
        const updated = await this.datasource.updateCategory(CategoryMapper.toUpdateDto(params));
        return CategoryMapper.toDomain(updated);
    }

    async delete(id: number): Promise<void> {
        await this.datasource.deleteCategory(id);
    }
}
