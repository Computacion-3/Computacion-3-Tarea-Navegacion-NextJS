import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoryContainer } from '../../di/category.container';
import {
    CreateCategoryParams,
    UpdateCategoryParams,
} from '../../domain/repositories/category.repository';
import { CategoryItemViewModel, CategoryViewModelMapper } from '../viewmodels/category.viewmodel';

interface CategoriesState {
    items: CategoryItemViewModel[];
    isLoading: boolean;
    isMutating: boolean;
    hasLoaded: boolean; // evita recargar en bucle cuando la lista queda vacía
    errorMessage: string | null;
}

const initialState: CategoriesState = {
    items: [],
    isLoading: false,
    isMutating: false,
    hasLoaded: false,
    errorMessage: null,
};

const toMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

const sortByName = (items: CategoryItemViewModel[]) =>
    items.sort((a, b) => a.name.localeCompare(b.name));

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const entities = await categoryContainer.getCategories.execute();
            return entities.map((e) => CategoryViewModelMapper.toViewModel(e));
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'Error al cargar categorías'));
        }
    }
);

export const createCategoryMutation = createAsyncThunk(
    'categories/create',
    async (params: CreateCategoryParams, { rejectWithValue }) => {
        try {
            const entity = await categoryContainer.createCategory.execute(params);
            return CategoryViewModelMapper.toViewModel(entity);
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo crear la categoría'));
        }
    }
);

export const updateCategoryMutation = createAsyncThunk(
    'categories/update',
    async (params: UpdateCategoryParams, { rejectWithValue }) => {
        try {
            const entity = await categoryContainer.updateCategory.execute(params);
            return CategoryViewModelMapper.toViewModel(entity);
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo actualizar la categoría'));
        }
    }
);

export const deleteCategoryMutation = createAsyncThunk(
    'categories/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await categoryContainer.deleteCategory.execute(id);
            return id;
        } catch (err: unknown) {
            return rejectWithValue(toMessage(err, 'No se pudo eliminar la categoría'));
        }
    }
);

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        // --- Lectura ---
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryItemViewModel[]>) => {
                state.isLoading = false;
                state.hasLoaded = true;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.hasLoaded = true;
                state.errorMessage = (action.payload as string) ?? 'Error al obtener categorías';
            });

        // --- Creación ---
        builder
            .addCase(createCategoryMutation.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(createCategoryMutation.fulfilled, (state, action: PayloadAction<CategoryItemViewModel>) => {
                state.isMutating = false;
                state.items = sortByName([...state.items, action.payload]);
            })
            .addCase(createCategoryMutation.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) ?? 'Error al guardar categoría';
            });

        // --- Edición ---
        builder
            .addCase(updateCategoryMutation.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(updateCategoryMutation.fulfilled, (state, action: PayloadAction<CategoryItemViewModel>) => {
                state.isMutating = false;
                state.items = sortByName(
                    state.items.map((c) => (c.id === action.payload.id ? action.payload : c)),
                );
            })
            .addCase(updateCategoryMutation.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) ?? 'Error al actualizar categoría';
            });

        // --- Eliminación ---
        builder
            .addCase(deleteCategoryMutation.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(deleteCategoryMutation.fulfilled, (state, action: PayloadAction<number>) => {
                state.isMutating = false;
                state.items = state.items.filter((c) => c.id !== action.payload);
            })
            .addCase(deleteCategoryMutation.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) ?? 'Error al eliminar categoría';
            });
    },
});

export const { clearError } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
