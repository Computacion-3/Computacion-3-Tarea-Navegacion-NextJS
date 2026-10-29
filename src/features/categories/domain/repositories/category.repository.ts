import { Category } from '../entities/category';

export interface CreateCategoryParams {
    name: string;
    color: string;
}

export interface UpdateCategoryParams {
    id: number;
    name: string;
    color: string;
}

export interface CategoryRepository {
    getAll(): Promise<Category[]>;

    getById(id: number): Promise<Category | null>;

    create(params: CreateCategoryParams): Promise<Category>;

    update(params: UpdateCategoryParams): Promise<Category>;

    delete(id: number): Promise<void>;
}
