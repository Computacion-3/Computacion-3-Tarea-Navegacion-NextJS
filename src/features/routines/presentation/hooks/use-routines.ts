'use client';

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useEffect } from "react";
import { createRoutines, fetchRoutines } from "../slices/routine.slice";
import { CreateRoutineParams } from "../../domain/repositories/routine.repository";


export function useRoutines() {
    const dispatch = useAppDispatch(); // publish
    const { items, isLoading, isMutating, errorMessage } = useAppSelector((state) => state.routines);
    useEffect(() => {
        dispatch(fetchRoutines())
    }, [dispatch])

    const createRoutine = async (params: CreateRoutineParams) => {
        const result = dispatch(createRoutines(params));
        return createRoutines.fulfilled.match(result); // True si se creo correctamente
    }

    return {
        routines: items,
        isLoading,
        isMutating,
        errorMessage,
        createRoutine
    };
}
