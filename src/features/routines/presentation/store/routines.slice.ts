import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { routineContainer } from '../../di/routine.container';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';
import { RoutineItemViewModel, RoutineViewModelMapper } from '../viewmodels/routine.viewmodel';

interface RoutinesState {
    items: RoutineItemViewModel[];
    isLoading: boolean;
    isMutating: boolean;
    errorMessage: string | null;
}

const initialState: RoutinesState = {
    items: [],
    isLoading: false,
    isMutating: false,
    errorMessage: null,
};

/**
 * 1. Thunk de Consulta / Lectura (Query)
 * Invoca el caso de uso GetRoutinesUseCase y mapea las entidades de dominio a ViewModels.
 */
export const fetchRoutines = createAsyncThunk(
    'routines/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const domainEntities = await routineContainer.getRoutines.execute();
            return domainEntities.map((entity) => RoutineViewModelMapper.toViewModel(entity));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al cargar rutinas';
            return rejectWithValue(message);
        }
    }
);

/**
 * 2. Thunk de Mutación (Mutation)
 * Invoca el caso de uso CreateRoutineUseCase para guardar una nueva rutina y retorna el nuevo ViewModel.
 */
export const createRoutineMutation = createAsyncThunk(
    'routines/create',
    async (params: CreateRoutineParams, { rejectWithValue }) => {
        try {
            const newEntity = await routineContainer.createRoutine.execute(params);
            return RoutineViewModelMapper.toViewModel(newEntity);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'No se pudo crear la rutina';
            return rejectWithValue(message);
        }
    }
);

export const routinesSlice = createSlice({
    name: 'routines',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        // --- Ciclo de vida de Lectura (fetchRoutines) ---
        builder
            .addCase(fetchRoutines.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchRoutines.fulfilled, (state, action: PayloadAction<RoutineItemViewModel[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchRoutines.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = (action.payload as string) ?? 'Error al obtener rutinas';
            });

        // --- Ciclo de vida de Mutación (createRoutineMutation) ---
        builder
            .addCase(createRoutineMutation.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(createRoutineMutation.fulfilled, (state, action: PayloadAction<RoutineItemViewModel>) => {
                state.isMutating = false;
                state.items.unshift(action.payload); // Actualización optimista/reactiva en el estado local
            })
            .addCase(createRoutineMutation.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) ?? 'Error al guardar rutina';
            });
    },
});

export const { clearError } = routinesSlice.actions;
export const routinesReducer = routinesSlice.reducer;
