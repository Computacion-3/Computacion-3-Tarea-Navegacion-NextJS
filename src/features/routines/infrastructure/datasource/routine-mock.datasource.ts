import { CreateRoutineDto, RoutineResponseDto } from "../dtos/routine.dto";
import { RoutineDatasource } from "./routine-datasource.interface";

export class RoutineMockDataSource implements RoutineDatasource {
    private routines: RoutineResponseDto[] = [
        {
            id: 1,
            name: "Pechito",
            description: "Es una rutina para sacar pecho"
        },
        {
            id: 2,
            name: "Brazo",
            description: "Curl y más"
        }
    ]
    async fetchRoutines(): Promise<RoutineResponseDto[]> {
        // fetch("http://localhost:8080/api")
        return [...this.routines];
    }
    async createRoutines(routine: CreateRoutineDto): Promise<RoutineResponseDto> {
        const nextId = this.routines.length + 1;
        const newRoutine: RoutineResponseDto = {
            id: nextId,
            name: routine.name,
            description: routine.description,
        }

        this.routines.push(newRoutine)
        return newRoutine;
    }

}