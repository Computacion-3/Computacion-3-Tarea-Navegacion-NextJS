import { Routine } from '../../domain/entities/routine';
import { CreateRoutineParams, UpdateRoutineParams } from '../../domain/repositories/routine.repository';
import { RoutineResponseDto, CreateRoutineDto, UpdateRoutineDto } from '../dtos/routine.dto';

export class RoutineMapper {
    static toDomain(dto: RoutineResponseDto): Routine {
        return new Routine({
            id: dto.id,
            name: dto.name,
            description: dto.description ?? undefined,
            createdAt: new Date(dto.created_at),
        });
    }

    static toDto(params: CreateRoutineParams): CreateRoutineDto {
        return {
            name: params.name.trim(),
            description: params.description?.trim(),
            userId: 1,
        };
    }

    static toUpdateDto(params: UpdateRoutineParams): UpdateRoutineDto {
        return {
            name: params.name.trim(),
            description: params.description?.trim(),
        };
    }
}
