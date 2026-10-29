import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authContainer } from '../../di/auth.container';
import { LoginParams, RegisterParams } from '../../domain/repositories/auth.repository';
import { AuthUserViewModel, AuthViewModelMapper } from '../viewmodels/auth.viewmodel';

interface AuthState {
    user: AuthUserViewModel | null;
    isInitialized: boolean; // ya se intentó restaurar la sesión guardada
    isLoading: boolean; // login / registro / logout en curso
    errorMessage: string | null;
}

const initialState: AuthState = {
    user: null,
    isInitialized: false,
    isLoading: false,
    errorMessage: null,
};

const toMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authContainer.getCurrentUser.execute();
            return user ? AuthViewModelMapper.toViewModel(user) : null;
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo restaurar la sesión'));
        }
    }
);

export const registerUserMutation = createAsyncThunk(
    'auth/register',
    async (params: RegisterParams, { rejectWithValue }) => {
        try {
            const user = await authContainer.registerUser.execute(params);
            return AuthViewModelMapper.toViewModel(user);
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo crear la cuenta'));
        }
    }
);

export const loginUserMutation = createAsyncThunk(
    'auth/login',
    async (params: LoginParams, { rejectWithValue }) => {
        try {
            const user = await authContainer.loginUser.execute(params);
            return AuthViewModelMapper.toViewModel(user);
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo iniciar sesión'));
        }
    }
);

export const logoutUserMutation = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authContainer.logoutUser.execute();
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo cerrar la sesión'));
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        // --- Restaurar sesión ---
        builder
            .addCase(restoreSession.fulfilled, (state, action: PayloadAction<AuthUserViewModel | null>) => {
                state.isInitialized = true;
                state.user = action.payload;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.isInitialized = true;
                state.user = null;
            });

        // --- Registro ---
        builder
            .addCase(registerUserMutation.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(registerUserMutation.fulfilled, (state, action: PayloadAction<AuthUserViewModel>) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.user = action.payload;
            })
            .addCase(registerUserMutation.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = (action.payload as string) ?? 'Error al crear la cuenta';
            });

        // --- Login ---
        builder
            .addCase(loginUserMutation.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(loginUserMutation.fulfilled, (state, action: PayloadAction<AuthUserViewModel>) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.user = action.payload;
            })
            .addCase(loginUserMutation.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = (action.payload as string) ?? 'Error al iniciar sesión';
            });

        // --- Logout ---
        builder
            .addCase(logoutUserMutation.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(logoutUserMutation.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
            })
            .addCase(logoutUserMutation.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = (action.payload as string) ?? 'Error al cerrar la sesión';
            });
    },
});

export const { clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
