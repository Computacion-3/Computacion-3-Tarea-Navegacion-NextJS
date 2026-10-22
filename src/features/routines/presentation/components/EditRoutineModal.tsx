'use client';

import { useState, useEffect } from 'react';
import { RoutineItemViewModel } from '../viewmodels/routine.viewmodel';
import { UpdateRoutineParams } from '../../domain/repositories/routine.repository';

interface EditRoutineModalProps {
    routine: RoutineItemViewModel | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (params: UpdateRoutineParams) => Promise<boolean>;
    isLoading: boolean;
}

export function EditRoutineModal({
    routine,
    isOpen,
    onClose,
    onSave,
    isLoading,
}: EditRoutineModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (routine) {
            setName(routine.title);
            const desc =
                routine.rawDescription ??
                (routine.descriptionText === 'Sin descripción asignada.' ? '' : routine.descriptionText);
            setDescription(desc || '');
            setFormError(null);
        }
    }, [routine, isOpen]);

    if (!isOpen || !routine) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        if (trimmedName.length < 3) {
            setFormError('El nombre debe tener al menos 3 caracteres.');
            return;
        }

        if (trimmedName.length > 100) {
            setFormError('El nombre no puede exceder los 100 caracteres.');
            return;
        }

        if (trimmedDesc.length > 0 && trimmedDesc.length < 10) {
            setFormError('La descripción debe tener al menos 10 caracteres si se proporciona.');
            return;
        }

        const success = await onSave({
            id: routine.id,
            name: trimmedName,
            description: trimmedDesc.length > 0 ? trimmedDesc : undefined,
        });

        if (success) {
            onClose();
        }
    };

    return (
        <div className="modal modal-open z-50">
            <div className="modal-box max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Editar Rutina #{routine.id}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>

                {formError && (
                    <div role="alert" className="alert alert-error text-xs py-2 mb-4">
                        <span>{formError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            rows={3}
                            placeholder="Ej. Rutina de tren superior con empujes y tracciones pesadas."
                            className="textarea textarea-bordered w-full"
                        />
                    </fieldset>

                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="btn btn-ghost"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop bg-black/40" onClick={!isLoading ? onClose : undefined} />
        </div>
    );
}
