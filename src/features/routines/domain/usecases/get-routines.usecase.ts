import { Routine } from '../entities/routine';
import { RoutineRepository } from '../repositories/routine.repository';

export class GetRoutinesUseCase {
    constructor(private readonly repository: RoutineRepository) { }

    async execute(): Promise<Routine[]> {
        const routines = await this.repository.getAll();
        return routines.sort((a, b) => a.name.localeCompare(b.name));
    }
}
