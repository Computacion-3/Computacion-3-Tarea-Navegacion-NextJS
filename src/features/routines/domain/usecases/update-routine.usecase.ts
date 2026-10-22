import { Routine } from '../entities/routine';
import { RoutineRepository, UpdateRoutineParams } from '../repositories/routine.repository';

export class UpdateRoutineUseCase {
    constructor(private readonly repository: RoutineRepository) { }

    async execute(params: UpdateRoutineParams): Promise<Routine> {
        return await this.repository.update(params);
    }
}
