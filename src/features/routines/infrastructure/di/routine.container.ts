import { CreateRoutineUseCase } from "../../domain/usecases/create-routine.usecase";
import { GetRoutineUseCase } from "../../domain/usecases/get-routine.usecase";
import { RoutineMockDataSource } from "../datasource/routine-mock.datasource";
import { RoutineRepositoryImpl } from "../repositories/routine.repository.impl";

const dataSource = new RoutineMockDataSource();
// const apiRealDataSource = new ApiDatasource();

// const repository = new RoutineRepositoryImpl(apiRealDataSource);
const repository = new RoutineRepositoryImpl(dataSource);

export const routineContainer = {
    getRoutines: new GetRoutineUseCase(repository),
    createRoutines: new CreateRoutineUseCase(repository)
}