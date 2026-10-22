import { RoutineResponseDto, CreateRoutineDto, UpdateRoutineDto } from '../dtos/routine.dto';

export interface RoutineDatasource {
    fetchRoutines(): Promise<RoutineResponseDto[]>;
    fetchRoutineById(id: number): Promise<RoutineResponseDto | null>;
    createRoutine(dto: CreateRoutineDto): Promise<RoutineResponseDto>;
    updateRoutine(id: number, dto: UpdateRoutineDto): Promise<RoutineResponseDto>;
    deleteRoutine(id: number): Promise<void>;
}
