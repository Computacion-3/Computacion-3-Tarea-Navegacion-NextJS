'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchRoutines, createRoutineMutation } from '../store/routines.slice';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';

/**
 * Hook fachada (Presentation Layer).
 * 
 * Actúa como adaptador entre los componentes de React y el Store de Redux:
 * 1. Oculta los detalles de Redux a los componentes visuales (RoutineForm, RoutineCard).
 * 2. Mantiene exactamente la misma API pública que tenía con useState.
 */
export function useRoutines() {
    const dispatch = useAppDispatch();

    // 1. Lectura del estado global gestionado por Redux
    const routines = useAppSelector((state) => state.routines.items);
    const isLoading = useAppSelector((state) => state.routines.isLoading);
    const isMutating = useAppSelector((state) => state.routines.isMutating);
    const errorMessage = useAppSelector((state) => state.routines.errorMessage);

    // 2. Carga inicial: si el store aún no tiene datos y no está cargando, solicitamos las rutinas
    useEffect(() => {
        if (routines.length === 0 && !isLoading) {
            dispatch(fetchRoutines());
        }
    }, [dispatch, routines.length, isLoading]);

    // 3. Mutación de creación: delega al thunk asíncrono
    const createRoutine = async (params: CreateRoutineParams): Promise<boolean> => {
        const resultAction = await dispatch(createRoutineMutation(params));
        // Devuelve true si la acción culminó en fulfilled (éxito), o false si fue rejected (error)
        return createRoutineMutation.fulfilled.match(resultAction);
    };

    // 4. Recarga manual
    const reload = useCallback(() => {
        dispatch(fetchRoutines());
    }, [dispatch]);

    return {
        routines,
        // La UI considera que está cargando si estamos en consulta inicial o en proceso de guardado
        isLoading: isLoading || isMutating,
        errorMessage,
        reload,
        createRoutine,
    };
}
