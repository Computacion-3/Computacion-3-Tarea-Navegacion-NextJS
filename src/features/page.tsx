'use client';

import { useMemo } from 'react';
import { useRoutines } from '@/src/features/routines/presentation/hooks/use-routines';
import { RoutineCard } from '@/src/features/routines/presentation/components/RoutineCard';
import { RoutineForm } from '@/src/features/routines/presentation/components/RoutineForm';
import { useCategories } from '@/src/features/categories/presentation/hooks/use-categories';
import { CategoryManager } from '@/src/features/categories/presentation/components/CategoryManager';

export default function RoutinesCleanPage() {
    const { routines, isLoading, errorMessage, createRoutine } = useRoutines();
    const {
        categories,
        isLoading: isLoadingCategories,
        errorMessage: categoriesError,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    // Une rutinas y categorías en la capa de presentación (los dos features siguen desacoplados)
    const categoryById = useMemo(
        () => new Map(categories.map((category) => [category.id, category])),
        [categories],
    );

    return (
        <main className="min-h-screen bg-neutral-100">
            <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
                <h1 className="sr-only">Rutinas</h1>

                {errorMessage && (
                    <div role="alert" className="alert alert-error text-sm">
                        <span>{errorMessage}</span>
                    </div>
                )}

                {isLoading && routines.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-12 text-sm opacity-60">
                        <span className="loading loading-spinner loading-md"></span>
                        <span>Cargando rutinas...</span>
                    </div>
                ) : routines.length === 0 ? (
                    <div className="alert alert-info">
                        <span>No hay rutinas registradas aún.</span>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {routines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                category={categoryById.get(routine.categoryId)}
                            />
                        ))}
                    </section>
                )}

                <div className="collapse collapse-arrow rounded-xl bg-white shadow-sm">
                    <input type="checkbox" aria-label="Mostrar formulario de nueva rutina" />
                    <div className="collapse-title font-semibold">Nueva rutina</div>
                    <div className="collapse-content">
                        <RoutineForm
                            onSubmit={createRoutine}
                            isLoading={isLoading}
                            categories={categories}
                        />
                    </div>
                </div>

                <div className="collapse collapse-arrow rounded-xl bg-white shadow-sm">
                    <input type="checkbox" aria-label="Mostrar administración de categorías" />
                    <div className="collapse-title font-semibold">Categorías</div>
                    <div className="collapse-content">
                        <CategoryManager
                            categories={categories}
                            isLoading={isLoadingCategories}
                            errorMessage={categoriesError}
                            onCreate={createCategory}
                            onUpdate={updateCategory}
                            onDelete={deleteCategory}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
