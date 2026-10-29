'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
    fetchCategories,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
} from '../store/categories.slice';
import {
    CreateCategoryParams,
    UpdateCategoryParams,
} from '../../domain/repositories/category.repository';

/**
 * Hook fachada (Presentation Layer) para el feature de categorías.
 * Oculta Redux a los componentes y expone una API simple.
 */
export function useCategories() {
    const dispatch = useAppDispatch();

    const categories = useAppSelector((state) => state.categories.items);
    const isLoading = useAppSelector((state) => state.categories.isLoading);
    const isMutating = useAppSelector((state) => state.categories.isMutating);
    const hasLoaded = useAppSelector((state) => state.categories.hasLoaded);
    const errorMessage = useAppSelector((state) => state.categories.errorMessage);

    // Carga inicial (una sola vez, aunque la lista quede vacía)
    useEffect(() => {
        if (!hasLoaded && !isLoading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, hasLoaded, isLoading]);

    const createCategory = async (params: CreateCategoryParams): Promise<boolean> => {
        const result = await dispatch(createCategoryMutation(params));
        return createCategoryMutation.fulfilled.match(result);
    };

    const updateCategory = async (params: UpdateCategoryParams): Promise<boolean> => {
        const result = await dispatch(updateCategoryMutation(params));
        return updateCategoryMutation.fulfilled.match(result);
    };

    const deleteCategory = async (id: number): Promise<boolean> => {
        const result = await dispatch(deleteCategoryMutation(id));
        return deleteCategoryMutation.fulfilled.match(result);
    };

    const reload = useCallback(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return {
        categories,
        isLoading: isLoading || isMutating,
        errorMessage,
        reload,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}
