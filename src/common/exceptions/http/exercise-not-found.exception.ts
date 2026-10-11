import { NotFoundException } from '@nestjs/common';

export class ExerciseNotFoundException extends NotFoundException {
    constructor(exerciseId: number, internalCode?: string) {
        super({
            error: 'Exercise Not Found',
            message: `El ejercicio con identificador ${exerciseId} no fue encontrado.`,
            code: internalCode,
        });
    }
}
