'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
    clearError,
    loginUserMutation,
    logoutUserMutation,
    registerUserMutation,
    restoreSession,
} from '../store/auth.slice';
import { LoginParams, RegisterParams } from '../../domain/repositories/auth.repository';

/**
 * Hook fachada (Presentation Layer) para autenticación.
 * Oculta Redux a los componentes y restaura la sesión guardada al montarse.
 */
export function useAuth() {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const isLoading = useAppSelector((state) => state.auth.isLoading);
    const errorMessage = useAppSelector((state) => state.auth.errorMessage);

    // Restauración de sesión: una sola vez (isInitialized pasa a true siempre, haya o no sesión)
    useEffect(() => {
        if (!isInitialized) {
            dispatch(restoreSession());
        }
    }, [dispatch, isInitialized]);

    const register = async (params: RegisterParams): Promise<boolean> => {
        const result = await dispatch(registerUserMutation(params));
        return registerUserMutation.fulfilled.match(result);
    };

    const login = async (params: LoginParams): Promise<boolean> => {
        const result = await dispatch(loginUserMutation(params));
        return loginUserMutation.fulfilled.match(result);
    };

    const logout = async (): Promise<boolean> => {
        const result = await dispatch(logoutUserMutation());
        return logoutUserMutation.fulfilled.match(result);
    };

    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        user,
        isAuthenticated: user !== null,
        isInitialized,
        isLoading,
        errorMessage,
        register,
        login,
        logout,
        clearError: resetError,
    };
}
