'use client';

import { useState } from 'react';
import { useRoutines } from '@/src/features/routines/presentation/hooks/use-routines';
import { RoutineCard } from '@/src/features/routines/presentation/components/RoutineCard';
import { RoutineForm } from '@/src/features/routines/presentation/components/RoutineForm';
import { EditRoutineModal } from '@/src/features/routines/presentation/components/EditRoutineModal';
import { RoutineItemViewModel } from '@/src/features/routines/presentation/viewmodels/routine.viewmodel';
import { UpdateRoutineParams } from '@/src/features/routines/domain/repositories/routine.repository';

export default function RoutinesCleanPage() {
    const {
        routines,
        isLoading,
        isMutating,
        errorMessage,
        createRoutine,
        updateRoutine,
        deleteRoutine,
    } = useRoutines();

    const [editingRoutine, setEditingRoutine] = useState<RoutineItemViewModel | null>(null);

    const handleOpenEdit = (routine: RoutineItemViewModel) => {
        setEditingRoutine(routine);
    };

    const handleCloseEdit = () => {
        setEditingRoutine(null);
    };

    const handleSaveEdit = async (params: UpdateRoutineParams): Promise<boolean> => {
        const success = await updateRoutine(params);
        if (success) {
            setEditingRoutine(null);
        }
        return success;
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            '¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.'
        );
        if (!confirmed) return;

        await deleteRoutine(id);
    };

    return (
        <main className="p-6 max-w-4xl mx-auto space-y-6">
            <header className="border-b border-base-200 pb-4">
                <h1 className="text-3xl font-bold">Gestión de Rutinas</h1>
                <p className="text-sm opacity-70 mt-1">
                    Crea, edita y administra tus rutinas de entrenamiento con Clean Architecture.
                </p>
            </header>

            {/* Formulario de Creación */}
            <section>
                <RoutineForm onSubmit={createRoutine} isLoading={isLoading || isMutating} />
            </section>

            {/* Error global */}
            {errorMessage && (
                <div role="alert" className="alert alert-error text-sm">
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Listado */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Rutinas Disponibles</h2>
                    <span className="badge badge-neutral">
                        {routines.length} {routines.length === 1 ? 'rutina' : 'rutinas'}
                    </span>
                </div>

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
                    <div className="grid grid-cols-1 gap-3">
                        {routines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onEdit={handleOpenEdit}
                                onDelete={handleDelete}
                                disabled={isMutating}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Modal de Edición */}
            <EditRoutineModal
                routine={editingRoutine}
                isOpen={Boolean(editingRoutine)}
                onClose={handleCloseEdit}
                onSave={handleSaveEdit}
                isLoading={isMutating}
            />
        </main>
    );
}
