import { Routine } from '../entities/routine';
import { RoutineRepository } from '../repositories/routine.repository';

export class GetRoutinesUseCase {
    constructor(private readonly repository: RoutineRepository) { }

    async execute(): Promise<Routine[]> {
        const routines = await this.repository.getAll();
        // Más recientes primero (coherente con el store, que inserta las nuevas al inicio)
        return [...routines].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
