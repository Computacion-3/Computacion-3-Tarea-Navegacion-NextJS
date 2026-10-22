import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoutineItemViewModel, RoutineViewModelMapper } from "../viewmodels/routine.viewmodel";
import { routineContainer } from "../../di/routine.container";
import { CreateRoutineParams, UpdateRoutineParams } from "../../domain/repositories/routine.repository";

type RoutineState = {
    items: RoutineItemViewModel[];
    isLoading: boolean;
    isMutating: boolean;
    errorMessage: string | null;
};

const initialState: RoutineState = {
    items: [],
    isLoading: false,
    isMutating: false,
    errorMessage: null,
};

export const fetchRoutines = createAsyncThunk(
    "routines/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const domainEntities = await routineContainer.getRoutines.execute();
            return domainEntities.map((entity) => RoutineViewModelMapper.toViewModel(entity));
        } catch (err: unknown) {
            console.error(err);
            return rejectWithValue("Hubo un error al obtener las rutinas");
        }
    }
);

export const createRoutines = createAsyncThunk(
    "routines/create",
    async (params: CreateRoutineParams, { rejectWithValue }) => {
        try {
            const domainEntity = await routineContainer.createRoutine.execute(params);
            return RoutineViewModelMapper.toViewModel(domainEntity);
        } catch (err: unknown) {
            console.error(err);
            return rejectWithValue(err instanceof Error ? err.message : "Hubo un error al crear la rutina");
        }
    }
);

export const updateRoutine = createAsyncThunk(
    "routines/update",
    async (params: UpdateRoutineParams, { rejectWithValue }) => {
        try {
            const domainEntity = await routineContainer.updateRoutine.execute(params);
            return RoutineViewModelMapper.toViewModel(domainEntity);
        } catch (err: unknown) {
            console.error(err);
            return rejectWithValue(err instanceof Error ? err.message : "Hubo un error al actualizar la rutina");
        }
    }
);

export const deleteRoutine = createAsyncThunk(
    "routines/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await routineContainer.deleteRoutine.execute(id);
            return id;
        } catch (err: unknown) {
            console.error(err);
            return rejectWithValue(err instanceof Error ? err.message : "Hubo un error al eliminar la rutina");
        }
    }
);

const slice = createSlice({
    name: "routines",
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
        changeLoading: (state) => {
            state.isLoading = !state.isLoading;
        },
    },
    extraReducers: (builder) => {
        // Fetch
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
                state.errorMessage = (action.payload as string) || "Hubo un error al cargar las rutinas";
            });

        // Create
        builder
            .addCase(createRoutines.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(createRoutines.fulfilled, (state, action: PayloadAction<RoutineItemViewModel>) => {
                state.isMutating = false;
                state.items.unshift(action.payload);
            })
            .addCase(createRoutines.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) || "Hubo un error al crear la rutina";
            });

        // Update
        builder
            .addCase(updateRoutine.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(updateRoutine.fulfilled, (state, action: PayloadAction<RoutineItemViewModel>) => {
                state.isMutating = false;
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateRoutine.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) || "Hubo un error al actualizar la rutina";
            });

        // Delete
        builder
            .addCase(deleteRoutine.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(deleteRoutine.fulfilled, (state, action: PayloadAction<number>) => {
                state.isMutating = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteRoutine.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) || "Hubo un error al eliminar la rutina";
            });
    },
});

export const { clearError, changeLoading } = slice.actions;
export const routineReducer = slice.reducer;
