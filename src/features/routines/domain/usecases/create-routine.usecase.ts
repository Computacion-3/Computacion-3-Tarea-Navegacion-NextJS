import { Routine } from '../entities/routine';
import { CreateRoutineParams, RoutineRepository } from '../repositories/routine.repository';

export class CreateRoutineUseCase {
    constructor(private readonly repository: RoutineRepository) { }

    async execute(params: CreateRoutineParams): Promise<Routine> {
        return await this.repository.create(params);
    }
}
