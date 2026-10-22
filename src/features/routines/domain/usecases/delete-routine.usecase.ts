import { RoutineRepository } from '../repositories/routine.repository';

export class DeleteRoutineUseCase {
    constructor(private readonly repository: RoutineRepository) { }

    async execute(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
