import { Routine } from '../entities/routine';

export interface CreateRoutineParams {
    name: string;
    description?: string;
    categoryId: number;
}

export interface RoutineRepository {
    getAll(): Promise<Routine[]>;

    getById(id: number): Promise<Routine | null>;

    create(params: CreateRoutineParams): Promise<Routine>;
}
