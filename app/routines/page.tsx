"use client";

import { useRoutines } from "@/src/features/routines/presentation/hooks/use-routines";

export default function RoutinePage() {
    const { routines, isLoading, errorMessage } = useRoutines();

    return (
        <div>
            <h1>Routines!</h1>
            {
                routines.map((routine) => <p key={routine.id}>{routine.name}</p>)
            }
        </div>
    )
}