'use client';

import { useState } from 'react';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';

interface RoutineFormProps {
    onSubmit: (params: CreateRoutineParams) => Promise<boolean>;
    isLoading: boolean;
}

export function RoutineForm({ onSubmit, isLoading }: RoutineFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (name.trim().length < 3) {
            setFormError('El nombre debe tener al menos 3 caracteres.');
            return;
        }

        const success = await onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
        });

        if (success) {
            setName('');
            setDescription('');
        }
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <form onSubmit={handleSubmit} className="card-body gap-4">
                <h2 className="card-title text-lg">Crear Nueva Rutina</h2>

                {formError && (
                    <div role="alert" className="alert alert-error text-xs py-2">
                        <span>{formError}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Nombre de la rutina *</legend>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ej. Hipertrofia Tren Superior"
                            className="input input-bordered w-full"
                        />
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Descripción (opcional)</legend>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ej. Enfocada en pecho y hombros"
                            className="input input-bordered w-full"
                        />
                    </fieldset>
                </div>

                <div className="card-actions justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                        Guardar Rutina
                    </button>
                </div>
            </form>
        </div>
    );
}
