interface CategoryBadgeProps {
    name: string;
    color: string;
}

// El color es dato (viene de la categoría), por eso va en style y no en clases de Tailwind
export function CategoryBadge({ name, color }: CategoryBadgeProps) {
    return (
        <span
            className="inline-block w-fit rounded-md border px-2.5 py-0.5 text-sm"
            style={{ borderColor: color, color }}
        >
            {name}
        </span>
    );
}
