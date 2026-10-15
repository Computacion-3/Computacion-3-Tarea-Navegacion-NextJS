import { Routine } from "../../domain/entities/routines";
import { CreateRoutineParams, RoutineRepository } from "../../domain/repositories/routine.repository";
import { RoutineDatasource } from "../datasource/routine-datasource.interface";

export class RoutineRepositoryImpl implements RoutineRepository {
    constructor(private readonly datasource: RoutineDatasource) { }

    getAll(): Promise<Routine[]> {
        
    }
    create(params: CreateRoutineParams): Promise<Routine> {
        // 
    }
}