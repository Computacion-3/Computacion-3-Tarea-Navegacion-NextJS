import { CategoryMockDatasource } from '../infrastructure/datasources/category-mock-datasource';
import { CategoryRepositoryImpl } from '../infrastructure/repositories/category.repository.impl';
import { GetCategoriesUseCase } from '../domain/usecases/get-categories.usecase';
import { CreateCategoryUseCase } from '../domain/usecases/create-category.usecase';
import { UpdateCategoryUseCase } from '../domain/usecases/update-category.usecase';
import { DeleteCategoryUseCase } from '../domain/usecases/delete-category.usecase';

const datasource = new CategoryMockDatasource();

const categoryRepository = new CategoryRepositoryImpl(datasource);

export const categoryContainer = {
    getCategories: new GetCategoriesUseCase(categoryRepository),
    createCategory: new CreateCategoryUseCase(categoryRepository),
    updateCategory: new UpdateCategoryUseCase(categoryRepository),
    deleteCategory: new DeleteCategoryUseCase(categoryRepository),
};

export type CategoryContainer = typeof categoryContainer;
