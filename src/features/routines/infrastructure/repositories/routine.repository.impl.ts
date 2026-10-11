import { Routine } from '../../domain/entities/routine';
import { CreateRoutineParams, RoutineRepository } from '../../domain/repositories/routine.repository';
import { RoutineDatasource } from '../datasources/routine-datasource.interface';
import { RoutineMapper } from '../mappers/routine.mapper';

export class RoutineRepositoryImpl implements RoutineRepository {
    constructor(private readonly datasource: RoutineDatasource) { }

    async getAll(): Promise<Routine[]> {
        const dtos = await this.datasource.fetchRoutines();
        return dtos.map((dto) => RoutineMapper.toDomain(dto));
    }

    async getById(id: number): Promise<Routine | null> {
        const dto = await this.datasource.fetchRoutineById(id);
        if (!dto) {
            return null;
        }
        return RoutineMapper.toDomain(dto);
    }

    async create(params: CreateRoutineParams): Promise<Routine> {
        const dtoToSend = RoutineMapper.toDto(params);
        const createdDto = await this.datasource.createRoutine(dtoToSend);
        return RoutineMapper.toDomain(createdDto);
    }
}
