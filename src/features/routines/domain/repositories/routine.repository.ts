import { Routine } from "../entities/routines";

export interface CreateRoutineParams {
    name: string;
    description?: string;

    userId: number;
}

export interface RoutineRepository {
    getAll(): Promise<Routine[]>;
    create(params: CreateRoutineParams): Promise<Routine>
}