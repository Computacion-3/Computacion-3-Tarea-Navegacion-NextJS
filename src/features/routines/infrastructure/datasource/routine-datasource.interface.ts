import { CreateRoutineDto, RoutineResponseDto } from "../dtos/routine.dto";

export interface RoutineDatasource {
    fetchRoutines(): Promise<RoutineResponseDto[]>;
    createRoutines(routine: CreateRoutineDto): Promise<RoutineResponseDto>;
}