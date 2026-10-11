import { NotFoundException } from '@nestjs/common';

export class RoutineNotFoundException extends NotFoundException {
    constructor(routineId: number, internalCode?: string) {
        super({
            error: 'Routine Not Found',
            message: `La rutina con identificador ${routineId} no fue encontrada.`,
            code: internalCode,
        });
    }
}
