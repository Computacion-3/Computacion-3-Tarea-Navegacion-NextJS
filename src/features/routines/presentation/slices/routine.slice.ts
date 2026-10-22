import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoutineItemViewModel, RoutineViewModelMapper } from "../viewmodels/routine.viewmodel";
import { routineContainer } from "../../di/routine.container";
import { CreateRoutineParams } from "../../domain/repositories/routine.repository";

type RoutineState = {
    items: RoutineItemViewModel[];
    isLoading: boolean;
    isMutating: boolean;
    errorMessage: string | null;
}

const initialState: RoutineState = {
    items: [],
    isLoading: false,
    isMutating: false,
    errorMessage: null,
}

export const fetchRoutines = createAsyncThunk(
    "routines/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const domainEntities = await routineContainer.getRoutines.execute();
            return domainEntities.map((entity) => RoutineViewModelMapper.toViewModel(entity)
            );
        } catch (err: unknown) {
            return rejectWithValue("Hubo un error");
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
            console.log(err);
            return rejectWithValue("Hubo un error");
        }
    }
);

const slice = createSlice({
    name: "routines",
    initialState,
    reducers: {
        clearError: (state) => { // dispatch(changeLoading())
            state.errorMessage = null;
        },
        changeLoading: (state) => {
            state.isLoading = !state.isLoading
        }
    },
    // Manipular elemento asincrónicos // THUNKS
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoutines.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            }) // Caso cuando recibo correctamente la rutina creada
            .addCase(fetchRoutines.fulfilled, (state, action: PayloadAction<RoutineItemViewModel[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchRoutines.rejected, (state) => {
                state.isLoading = false;
                state.errorMessage = "Hubo un error tremendo";
            });
        builder
            .addCase(createRoutines.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(createRoutines.fulfilled, (state, action: PayloadAction<RoutineItemViewModel>) => {
                state.isMutating = false;
                state.items.unshift(action.payload)
            })
            .addCase(createRoutines.rejected, (state) => {
                state.isMutating = false;
                state.errorMessage = "Hubo un error al mutar";
            })
    },
});

export const { clearError, changeLoading } = slice.actions;
export const routineReducer = slice.reducer;