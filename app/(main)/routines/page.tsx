'use client';

import { useRoutines } from '@/src/features/routines/presentation/hooks/use-routines';
import { RoutineCard } from '@/src/features/routines/presentation/components/RoutineCard';
import { RoutineForm } from '@/src/features/routines/presentation/components/RoutineForm';

export default function RoutinesCleanPage() {
    const { routines, isLoading, errorMessage, createRoutine } = useRoutines();

    return (
        <main className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
            <h1 className="sr-only">Rutinas</h1>

            {errorMessage && (
                <div role="alert" className="alert alert-error text-sm">
                    <span>{errorMessage}</span>
                </div>
            )}

            {isLoading && routines.length === 0 ? (
                <div className="flex justify-center items-center py-12 gap-3 text-sm opacity-60">
                    <span className="loading loading-spinner loading-md"></span>
                    <span>Cargando rutinas...</span>
                </div>
            ) : routines.length === 0 ? (
                <div className="alert alert-info">
                    <span>No hay rutinas registradas aún.</span>
                </div>
            ) : (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {routines.map((routine) => (
                        <RoutineCard key={routine.id} routine={routine} />
                    ))}
                </section>
            )}

            <div className="collapse collapse-arrow bg-base-100 shadow-sm">
                <input type="checkbox" aria-label="Mostrar formulario de nueva rutina" />
                <div className="collapse-title font-semibold">Nueva rutina</div>
                <div className="collapse-content">
                    <RoutineForm onSubmit={createRoutine} isLoading={isLoading} />
                </div>
            </div>
        </main>
    );
}