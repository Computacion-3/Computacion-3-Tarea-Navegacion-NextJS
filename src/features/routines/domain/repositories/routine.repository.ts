import { Routine } from '../entities/routine';

export interface CreateRoutineParams {
    name: string;
    description?: string;
}

export interface UpdateRoutineParams {
    id: number;
    name: string;
    description?: string;
}

export interface RoutineRepository {
    getAll(): Promise<Routine[]>;

    getById(id: number): Promise<Routine | null>;

    create(params: CreateRoutineParams): Promise<Routine>;

    update(params: UpdateRoutineParams): Promise<Routine>;

    delete(id: number): Promise<void>;
}
