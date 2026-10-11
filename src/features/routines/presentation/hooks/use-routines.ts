'use client';

import { useState, useEffect, useCallback } from 'react';
import { Routine } from '../../domain/entities/routine';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';
import { routineContainer } from '../../di/routine.container';

export function useRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Memorización con useCallback para garantizar estabilidad de referencia y satisfacer exhaustive-deps
    const loadRoutines = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const data = await routineContainer.getRoutines.execute();
            setRoutines(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido al cargar rutinas';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRoutines();
    }, [loadRoutines]);

    const createRoutine = async (params: CreateRoutineParams): Promise<boolean> => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const newRoutine = await routineContainer.createRoutine.execute(params);
            setRoutines((prev) => [newRoutine, ...prev]);
            return true;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'No se pudo guardar la rutina';
            setErrorMessage(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        routines,
        isLoading,
        errorMessage,
        reload: loadRoutines,
        createRoutine,
    };
}
