import { Routine } from "../../domain/entities/routines";
import { CreateRoutineParams, RoutineRepository } from "../../domain/repositories/routine.repository";
import { RoutineDatasource } from "../datasource/routine-datasource.interface";
import { RoutineMapper } from "../mappers/routine.mapper";

export class RoutineRepositoryImpl implements RoutineRepository {
    constructor(private readonly datasource: RoutineDatasource) { }

    async getAll(): Promise<Routine[]> {
        const dtos = await this.datasource.fetchRoutines();
        console.log("Capa infraestructura:", dtos)
        return dtos.map(dto => RoutineMapper.toDomain(dto))
    }
    async create(params: CreateRoutineParams): Promise<Routine> {
        const dtoToSend = RoutineMapper.toCreateDto(params);
        const response = await this.datasource.createRoutines(dtoToSend);
        return RoutineMapper.toDomain(response);
    }
}