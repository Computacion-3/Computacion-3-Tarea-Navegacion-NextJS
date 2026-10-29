export const ROUTINE_CATEGORIES = ['strength', 'hypertrophy', 'endurance'] as const;

export type RoutineCategory = (typeof ROUTINE_CATEGORIES)[number];

export function isRoutineCategory(value: unknown): value is RoutineCategory {
    return typeof value === 'string' && (ROUTINE_CATEGORIES as readonly string[]).includes(value);
}
