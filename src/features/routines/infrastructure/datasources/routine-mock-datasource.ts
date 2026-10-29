import { RoutineDatasource } from './routine-datasource.interface';
import { RoutineResponseDto, CreateRoutineDto } from '../dtos/routine.dto';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DAY_MS = 1000 * 60 * 60 * 24;

// category_id coincide con los ids del datasource mock de `categories`: 1 Fuerza, 2 Hipertrofia, 3 Resistencia
export class RoutineMockDatasource implements RoutineDatasource {
    private routines: RoutineResponseDto[] = [
        {
            id: 1,
            name: 'Cardio suave',
            description: 'Bicicleta y caminata inclinada',
            category_id: 3,
            created_at: new Date(Date.now() - DAY_MS * 3).toISOString(), // Hace 3 días
        },
        {
            id: 2,
            name: 'Torso y brazos',
            description: 'Press banca, remo y dominadas',
            category_id: 2,
            created_at: new Date(Date.now() - DAY_MS * 2).toISOString(), // Hace 2 días
        },
        {
            id: 3,
            name: 'Pierna pesada',
            description: 'Sentadilla, peso muerto y zancadas',
            category_id: 1,
            created_at: new Date(Date.now() - DAY_MS).toISOString(), // Hace 1 día
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
            category_id: dto.categoryId,
            created_at: new Date().toISOString(),
        };

        this.routines.push(newRoutine);
        return { ...newRoutine };
    }
}
