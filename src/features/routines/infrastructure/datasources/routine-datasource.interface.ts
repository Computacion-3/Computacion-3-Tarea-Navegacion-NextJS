import { RoutineResponseDto, CreateRoutineDto } from '../dtos/routine.dto';

export interface RoutineDatasource {
    fetchRoutines(): Promise<RoutineResponseDto[]>;
    fetchRoutineById(id: number): Promise<RoutineResponseDto | null>;
    createRoutine(dto: CreateRoutineDto): Promise<RoutineResponseDto>;
}
