'use client';

import { useState } from 'react';
import {
    CreateCategoryParams,
    UpdateCategoryParams,
} from '../../domain/repositories/category.repository';
import { CategoryItemViewModel } from '../viewmodels/category.viewmodel';
import { CategoryBadge } from './CategoryBadge';

interface CategoryManagerProps {
    categories: CategoryItemViewModel[];
    isLoading: boolean;
    errorMessage: string | null;
    onCreate: (params: CreateCategoryParams) => Promise<boolean>;
    onUpdate: (params: UpdateCategoryParams) => Promise<boolean>;
    onDelete: (id: number) => Promise<boolean>;
}

const DEFAULT_COLOR = '#4f2de0';

export function CategoryManager({
    categories,
    isLoading,
    errorMessage,
    onCreate,
    onUpdate,
    onDelete,
}: CategoryManagerProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [formError, setFormError] = useState<string | null>(null);

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setColor(DEFAULT_COLOR);
        setFormError(null);
    };

    const startEditing = (category: CategoryItemViewModel) => {
        setEditingId(category.id);
        setName(category.name);
        setColor(category.color);
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (name.trim().length < 3) {
            setFormError('El nombre debe tener al menos 3 caracteres.');
            return;
        }

        const success = editingId === null
            ? await onCreate({ name: name.trim(), color })
            : await onUpdate({ id: editingId, name: name.trim(), color });

        if (success) {
            resetForm();
        }
    };

    const handleDelete = async (category: CategoryItemViewModel) => {
        if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) {
            return;
        }
        const success = await onDelete(category.id);
        if (success && editingId === category.id) {
            resetForm();
        }
    };

    return (
        <div className="space-y-4">
            {errorMessage && (
                <div role="alert" className="alert alert-error text-xs py-2">
                    <span>{errorMessage}</span>
                </div>
            )}

            {categories.length === 0 ? (
                <p className="text-sm opacity-60">No hay categorías registradas.</p>
            ) : (
                <ul className="divide-y divide-base-200">
                    {categories.map((category) => (
                        <li key={category.id} className="flex items-center justify-between py-2">
                            <CategoryBadge name={category.name} color={category.color} />
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-xs"
                                    disabled={isLoading}
                                    onClick={() => startEditing(category)}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-xs text-error"
                                    disabled={isLoading}
                                    onClick={() => handleDelete(category)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
                <fieldset className="fieldset grow">
                    <legend className="fieldset-legend">
                        {editingId === null ? 'Nueva categoría' : 'Editar categoría'}
                    </legend>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        placeholder="Ej. Movilidad"
                        className="input input-bordered w-full"
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Color</legend>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        disabled={isLoading}
                        aria-label="Color de la categoría"
                        className="h-10 w-14 cursor-pointer rounded border border-base-300 bg-transparent p-1"
                    />
                </fieldset>

                <div className="flex gap-2">
                    <button type="submit" disabled={isLoading} className="btn btn-primary">
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                        {editingId === null ? 'Agregar' : 'Guardar cambios'}
                    </button>
                    {editingId !== null && (
                        <button type="button" className="btn btn-ghost" onClick={resetForm}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {formError && (
                <div role="alert" className="alert alert-error text-xs py-2">
                    <span>{formError}</span>
                </div>
            )}
        </div>
    );
}
