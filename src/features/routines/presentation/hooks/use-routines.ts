'use client';

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useEffect } from "react";
import {
    createRoutines,
    fetchRoutines,
    updateRoutine as updateRoutineThunk,
    deleteRoutine as deleteRoutineThunk,
} from "../slices/routine.slice";
import { CreateRoutineParams, UpdateRoutineParams } from "../../domain/repositories/routine.repository";

export function useRoutines() {
    const dispatch = useAppDispatch();
    const { items, isLoading, isMutating, errorMessage } = useAppSelector((state) => state.routines);

    useEffect(() => {
        dispatch(fetchRoutines());
    }, [dispatch]);

    const createRoutine = async (params: CreateRoutineParams): Promise<boolean> => {
        const result = await dispatch(createRoutines(params));
        return createRoutines.fulfilled.match(result);
    };

    const updateRoutine = async (params: UpdateRoutineParams): Promise<boolean> => {
        const result = await dispatch(updateRoutineThunk(params));
        return updateRoutineThunk.fulfilled.match(result);
    };

    const deleteRoutine = async (id: number): Promise<boolean> => {
        const result = await dispatch(deleteRoutineThunk(id));
        return deleteRoutineThunk.fulfilled.match(result);
    };

    return {
        routines: items,
        isLoading,
        isMutating,
        errorMessage,
        createRoutine,
        updateRoutine,
        deleteRoutine,
    };
}
