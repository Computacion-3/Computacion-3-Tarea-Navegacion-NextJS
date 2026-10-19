"use client";

import { useEffect, useState } from "react";
import { Routine } from "../../domain/entities/routines";
import { routineContainer } from "../../infrastructure/di/routine.container";

export function useRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>();


    useEffect(() => {
        const getRoutines = async () => {
            try {
                setIsLoading(true)
                console.log("Checking");
                const routines = await routineContainer.getRoutines.execute();
                console.log("Rutinas: ", routines)
                setRoutines(routines);
            } catch (err) {
                console.log(err);
                setErrorMessage("Hubo un error, diablos")
            } finally {
                setIsLoading(false);
            }
        }

        getRoutines();
    }, [])


    return {
        routines,
        isLoading,
        errorMessage,
    }
} 