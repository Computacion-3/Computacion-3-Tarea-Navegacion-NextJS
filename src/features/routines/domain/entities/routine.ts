export interface RoutineProps {
    readonly id: number;
    readonly name: string;
    readonly description?: string;
    readonly categoryId: number; // Referencia al feature `categories` (solo el id, sin acoplar dominios)
    readonly createdAt: Date;
}

export class Routine {
    readonly id: number;
    readonly name: string;
    readonly description?: string;
    readonly categoryId: number;
    readonly createdAt: Date;

    constructor(props: RoutineProps) {
        this.validate(props);
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.categoryId = props.categoryId;
        this.createdAt = props.createdAt;
    }

    private validate(props: RoutineProps): void {
        if (!props.name || props.name.trim().length < 3) {
            throw new Error('El nombre de la rutina debe tener al menos 3 caracteres.');
        }

        if (props.name.trim().length > 100) {
            throw new Error('El nombre de la rutina no puede exceder los 100 caracteres.');
        }

        if (props.description !== undefined && props.description.trim().length > 0 && props.description.trim().length < 10) {
            throw new Error('La descripción debe tener al menos 10 caracteres explicativos si se proporciona.');
        }

        if (!Number.isInteger(props.categoryId) || props.categoryId <= 0) {
            throw new Error('La rutina debe pertenecer a una categoría válida.');
        }
    }

    hasDescription(): boolean {
        return Boolean(this.description && this.description.trim().length > 0);
    }
}
