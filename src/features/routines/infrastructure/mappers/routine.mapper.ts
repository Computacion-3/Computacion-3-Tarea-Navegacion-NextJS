import { Routine } from '../../domain/entities/routine';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';
import { RoutineResponseDto, CreateRoutineDto } from '../dtos/routine.dto';

export class RoutineMapper {
    static toDomain(dto: RoutineResponseDto): Routine {
        return new Routine({
            id: dto.id,
            name: dto.name,
            description: dto.description ?? undefined,
            categoryId: dto.category_id,
            createdAt: new Date(dto.created_at),
        });
    }

    static toDto(params: CreateRoutineParams): CreateRoutineDto {
        return {
            name: params.name.trim(),
            description: params.description?.trim(),
            categoryId: params.categoryId,
            userId: 1,
        };
    }
}
