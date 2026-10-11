'use client';

import { useState, useEffect } from 'react';

// Tipado acoplado directamente al JSON del backend
interface RoutineFromApi {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
}

export default function RoutinePage() {
    const [routines, setRoutines] = useState<RoutineFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // 1. Acceso a red directo en el componente
    useEffect(() => {
        fetch('http://localhost:3000/api/routine')
            .then((res) => res.json())
            .then((data) => {
                setRoutines(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // 2. Lógica de negocio e invariantes mezcladas con el evento de la vista
    const handleCreate = async () => {
        if (name.trim().length < 3) {
            alert('El nombre de la rutina debe tener al menos 3 caracteres');
            return;
        }

        if (description.trim().length > 0 && description.trim().length < 10) {
            alert('La descripción debe tener al menos 10 caracteres si se proporciona');
            return;
        }

        // 3. Payload formateado a mano según exigencias del backend
        const payload = {
            name: name.trim(),
            description: description.trim() || undefined,
            userId: 1,
        };

        try {
            const res = await fetch('http://localhost:3000/api/routine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const created = await res.json();
            setRoutines((prev) => [...prev, created]);
            setName('');
            setDescription('');
        } catch (err) {
            console.error(err);
        }
    };

    // 4. Renderizado visual con estilos y estado todo en el mismo componente
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gestión de Rutinas</h1>

            <div className="flex flex-col gap-2 mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre de la rutina"
                    className="border p-2 rounded"
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción"
                    className="border p-2 rounded"
                />
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded self-start"
                >
                    Guardar Rutina
                </button>
            </div>

            {loading ? (
                <p>Cargando rutinas...</p>
            ) : (
                <ul className="space-y-2">
                    {routines.map((item) => (
                        <li key={item.id} className="p-3 border rounded shadow-sm">
                            <span className="font-semibold">{item.name}</span> - {item.description ?? 'Sin descripción'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
