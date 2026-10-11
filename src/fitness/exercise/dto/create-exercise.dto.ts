import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateExerciseDto {
    @IsString({ message: 'El nombre del ejercicio debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
    @MaxLength(100, { message: 'El nombre del ejercicio no puede exceder 100 caracteres' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    description?: string;

    @IsOptional()
    @IsString({ message: 'El tipo debe ser una cadena de texto' })
    @MaxLength(50, { message: 'El tipo no puede exceder 50 caracteres' })
    type?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Las calorías estimadas deben ser un número' })
    @IsPositive({ message: 'Las calorías estimadas deben ser un número positivo' })
    estimatedCalories?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La distancia estimada en km debe ser un número' })
    @IsPositive({ message: 'La distancia estimada en km debe ser un número positivo' })
    estimatedDistanceKm?: number;

    @IsOptional()
    @IsNumber({}, { message: 'La duración estimada en minutos debe ser un número' })
    @IsPositive({ message: 'La duración estimada en minutos debe ser un número positivo' })
    estimatedDurationMin?: number;

    @IsOptional()
    @IsString({ message: 'El ícono debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El ícono no puede exceder 255 caracteres' })
    icon?: string;
}
