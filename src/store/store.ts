import { configureStore } from "@reduxjs/toolkit"
import { routineReducer } from "../features/routines/presentation/slices/routine.slice"
export const makeStore = () => {
    return configureStore({
        reducer: {
            // Cada uno de los reductores de la aplicacion
            routines: routineReducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore> // SecurityContextHolder
export type RootState = ReturnType<AppStore['getState']> // UserDetails
export type AppDispatch = AppStore['dispatch']

