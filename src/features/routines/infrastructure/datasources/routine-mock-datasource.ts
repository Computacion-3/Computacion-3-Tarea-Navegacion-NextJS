import { RoutineDatasource } from './routine-datasource.interface';
import { RoutineResponseDto, CreateRoutineDto } from '../dtos/routine.dto';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RoutineMockDatasource implements RoutineDatasource {
    private routines: RoutineResponseDto[] = [
        {
            id: 1,
            name: 'Torso Fuerza e Hipertrofia',
            description: 'Rutina de tren superior enfocada en empujes y tracciones pesadas.',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // Hace 3 días
        },
        {
            id: 2,
            name: 'Pierna Completa e Isquios',
            description: 'Rutina de tren inferior con énfasis en sentadilla libre y peso muerto.',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Hace 2 días
        },
        {
            id: 3,
            name: 'Full Body Funcional',
            description: 'Circuito metabólico de cuerpo completo para resistencia y quema calórica.',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // Hace 12 horas
        },
    ];

    async fetchRoutines(): Promise<RoutineResponseDto[]> {
        await delay(600); // Simulamos latencia de red de 600ms
        return [...this.routines];
    }

    async fetchRoutineById(id: number): Promise<RoutineResponseDto | null> {
        await delay(400);
        const found = this.routines.find((r) => r.id === id);
        return found ? { ...found } : null;
    }

    async createRoutine(dto: CreateRoutineDto): Promise<RoutineResponseDto> {
        await delay(800); // Simulamos latencia de guardado de 800ms
        const nextId = this.routines.length > 0
            ? Math.max(...this.routines.map((r) => r.id)) + 1
            : 1;

        const newRoutine: RoutineResponseDto = {
            id: nextId,
            name: dto.name,
            description: dto.description,
            created_at: new Date().toISOString(),
        };

        this.routines.push(newRoutine);
        return { ...newRoutine };
    }
}
