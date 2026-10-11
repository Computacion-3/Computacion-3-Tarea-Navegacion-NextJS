import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { RoutineExerciseItemDto } from './routine-exercise-item.dto';

export class CreateRoutineDto {
    @IsString({ message: 'El nombre de la rutina debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' })
    @MaxLength(100, { message: 'El nombre de la rutina no puede exceder 100 caracteres' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    description?: string;

    @IsOptional()
    @IsInt({ message: 'El userId debe ser un número entero' })
    @IsPositive({ message: 'El userId debe ser un número positivo' })
    userId?: number;

    @IsOptional()
    @IsArray({ message: 'exercises debe ser una lista de ejercicios' })
    @ValidateNested({ each: true })
    @Type(() => RoutineExerciseItemDto)
    exercises?: RoutineExerciseItemDto[];
}
