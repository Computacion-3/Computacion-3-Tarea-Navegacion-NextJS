export interface CategoryProps {
    readonly id: number;
    readonly name: string;
    readonly color: string; // Hex #RRGGBB
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/**
 * Reglas de validación reutilizables: las usa la entidad al construirse
 * y los casos de uso antes de persistir (para no guardar datos inválidos).
 */
export function validateCategoryFields(name: string, color: string): void {
    const trimmed = name?.trim() ?? '';

    if (trimmed.length < 3) {
        throw new Error('El nombre de la categoría debe tener al menos 3 caracteres.');
    }

    if (trimmed.length > 30) {
        throw new Error('El nombre de la categoría no puede exceder los 30 caracteres.');
    }

    if (!HEX_COLOR.test(color)) {
        throw new Error('El color debe tener formato hexadecimal (#RRGGBB).');
    }
}

export class Category {
    readonly id: number;
    readonly name: string;
    readonly color: string;

    constructor(props: CategoryProps) {
        validateCategoryFields(props.name, props.color);
        this.id = props.id;
        this.name = props.name.trim();
        this.color = props.color;
    }
}
