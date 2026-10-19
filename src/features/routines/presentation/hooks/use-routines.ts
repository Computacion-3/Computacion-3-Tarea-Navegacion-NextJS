'use client';

import { useState, useEffect, useCallback } from 'react';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';
import { routineContainer } from '../../di/routine.container';
import { RoutineItemViewModel, RoutineViewModelMapper } from '../viewmodels/routine.viewmodel';

export function useRoutines() {
    // El estado ahora almacena ViewModels preparados para la UI
    const [routines, setRoutines] = useState<RoutineItemViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Carga inicial al montar: el método se define dentro del useEffect
    useEffect(() => {
        let isMounted = true;

        const loadInitialRoutines = async () => {
            try {
                const domainEntities = await routineContainer.getRoutines.execute();
                if (isMounted) {
                    // Aduana Presentation: Dominio -> ViewModel
                    const viewModels = domainEntities.map((entity) =>
                        RoutineViewModelMapper.toViewModel(entity)
                    );
                    setRoutines(viewModels);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const message =
                        err instanceof Error ? err.message : 'Error desconocido al cargar rutinas';
                    setErrorMessage(message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialRoutines();

        return () => {
            isMounted = false;
        };
    }, []);

    // Recarga manual (disparada por el usuario)
    const reload = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const domainEntities = await routineContainer.getRoutines.execute();
            const viewModels = domainEntities.map((entity) =>
                RoutineViewModelMapper.toViewModel(entity)
            );
            setRoutines(viewModels);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Error desconocido al recargar rutinas';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Creación de rutina: caso de uso + actualización del estado con ViewModel
    const createRoutine = async (params: CreateRoutineParams): Promise<boolean> => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const newEntity = await routineContainer.createRoutine.execute(params);

            // Mapeo inmediato de la nueva entidad a ViewModel
            const newViewModel = RoutineViewModelMapper.toViewModel(newEntity);
            setRoutines((prev) => [newViewModel, ...prev]);
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
        reload,
        createRoutine,
    };
}
