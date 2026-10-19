import { Routine } from "../../domain/entities/routines";
import { CreateRoutineParams } from "../../domain/repositories/routine.repository";
import { CreateRoutineDto, RoutineResponseDto } from "../dtos/routine.dto";

export class RoutineMapper {
    // 
    static toCreateDto(entity: CreateRoutineParams): CreateRoutineDto {
        return {
            name: entity.name,
            description: entity.description,
            userId: 1
        }
    }

    // Response Backend -> Routine Entity
    static toDomain(dto: RoutineResponseDto): Routine {
        return new Routine({
            id: dto.id,
            name: dto.name,
            description: dto.description ?? "Description not defined",
        })
    }
}