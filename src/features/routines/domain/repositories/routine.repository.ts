import { Routine } from "../entities/routines";

export interface CreateRoutineParams {
    name: string;
    description?: string;
}

export interface RoutineRepository {
    getAll(): Promise<Routine[]>;
    create(params: CreateRoutineParams): Promise<Routine>
}