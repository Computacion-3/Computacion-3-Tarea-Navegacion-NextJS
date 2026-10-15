import { Routine } from "../entities/routines";
import { CreateRoutineParams, RoutineRepository } from "../repositories/routine.repository";

export class CreateRoutineUseCase {
    constructor(private readonly repository: RoutineRepository) { };

    async execute(params: CreateRoutineParams): Promise<Routine> {
        // Respectivas reglas de negocio que hagan parte del proceso de crear una rutina
        return await this.repository.create(params);
    }
}