import { Routine } from "../entities/routines";
import { RoutineRepository } from "../repositories/routine.repository";

export class GetRoutineUseCase {
    constructor(private readonly repository: RoutineRepository) { };

    async execute(): Promise<Routine[]> {
        // Respectivas reglas de negocio que hagan parte del proceso de crear una rutina
        console.log("Dentro del use case")
        return await this.repository.getAll();
    }
}