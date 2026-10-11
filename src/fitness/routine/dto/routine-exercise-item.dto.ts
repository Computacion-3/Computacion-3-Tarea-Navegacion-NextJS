import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class RoutineExerciseItemDto {
    @IsInt({ message: 'El id del ejercicio debe ser un número entero' })
    @IsNotEmpty({ message: 'El id del ejercicio es obligatorio' })
    @IsPositive({ message: 'El id del ejercicio debe ser un número positivo' })
    exerciseId: number;

    @IsOptional()
    @IsInt({ message: 'orderIndex debe ser un número entero' })
    @Min(0, { message: 'orderIndex no puede ser negativo' })
    orderIndex?: number;

    @IsOptional()
    @IsInt({ message: 'targetSets debe ser un número entero' })
    @IsPositive({ message: 'targetSets debe ser mayor que 0' })
    targetSets?: number;

    @IsOptional()
    @IsInt({ message: 'targetReps debe ser un número entero' })
    @IsPositive({ message: 'targetReps debe ser mayor que 0' })
    targetReps?: number;

    @IsOptional()
    @IsNumber({}, { message: 'targetWeightKg debe ser un número' })
    @IsPositive({ message: 'targetWeightKg debe ser mayor que 0' })
    targetWeightKg?: number;

    @IsOptional()
    @IsInt({ message: 'targetDurationMin debe ser un número entero' })
    @IsPositive({ message: 'targetDurationMin debe ser mayor que 0' })
    targetDurationMin?: number;
}
