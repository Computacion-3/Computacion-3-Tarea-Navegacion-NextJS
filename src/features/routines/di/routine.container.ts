import { RoutineMockDatasource } from '../infrastructure/datasources/routine-mock-datasource';
import { RoutineRepositoryImpl } from '../infrastructure/repositories/routine.repository.impl';
import { GetRoutinesUseCase } from '../domain/usecases/get-routines.usecase';
import { CreateRoutineUseCase } from '../domain/usecases/create-routine.usecase';
import { UpdateRoutineUseCase } from '../domain/usecases/update-routine.usecase';
import { DeleteRoutineUseCase } from '../domain/usecases/delete-routine.usecase';

const datasource = new RoutineMockDatasource();

const routineRepository = new RoutineRepositoryImpl(datasource);

export const routineContainer = {
    getRoutines: new GetRoutinesUseCase(routineRepository),
    createRoutine: new CreateRoutineUseCase(routineRepository),
    updateRoutine: new UpdateRoutineUseCase(routineRepository),
    deleteRoutine: new DeleteRoutineUseCase(routineRepository),
};

export type RoutineContainer = typeof routineContainer;
