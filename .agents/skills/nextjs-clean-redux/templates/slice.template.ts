import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { {{EntityName}}ItemViewModel, {{EntityName}}ViewModelMapper } from '../viewmodels/{{entity-slug}}.viewmodel';
import { {{entityCamelCase}}Container } from '../../di/{{entity-slug}}.container';
import { Create{{EntityName}}Params } from '../../domain/repositories/{{entity-slug}}.repository';

type {{EntityName}}State = {
    items: {{EntityName}}ItemViewModel[];
    isLoading: boolean;
    isMutating: boolean;
    errorMessage: string | null;
};

const initialState: {{EntityName}}State = {
    items: [],
    isLoading: false,
    isMutating: false,
    errorMessage: null,
};

export const fetch{{EntityNamePlural}} = createAsyncThunk(
    '{{entityCamelCasePlural}}/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const domainEntities = await {{entityCamelCase}}Container.get{{EntityNamePlural}}.execute();
            return domainEntities.map((entity) =>
                {{EntityName}}ViewModelMapper.toViewModel(entity)
            );
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch {{entity-slug-plural}}';
            return rejectWithValue(message);
        }
    }
);

export const create{{EntityName}} = createAsyncThunk(
    '{{entityCamelCasePlural}}/create',
    async (params: Create{{EntityName}}Params, { rejectWithValue }) => {
        try {
            const domainEntity = await {{entityCamelCase}}Container.create{{EntityName}}.execute(params);
            return {{EntityName}}ViewModelMapper.toViewModel(domainEntity);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create {{entity-slug}}';
            return rejectWithValue(message);
        }
    }
);

const slice = createSlice({
    name: '{{entityCamelCasePlural}}',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch{{EntityNamePlural}}.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetch{{EntityNamePlural}}.fulfilled, (state, action: PayloadAction<{{EntityName}}ItemViewModel[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetch{{EntityNamePlural}}.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = (action.payload as string) || 'Error loading items';
            });

        builder
            .addCase(create{{EntityName}}.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(create{{EntityName}}.fulfilled, (state, action: PayloadAction<{{EntityName}}ItemViewModel>) => {
                state.isMutating = false;
                state.items.unshift(action.payload);
            })
            .addCase(create{{EntityName}}.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) || 'Error creating item';
            });
    },
});

export const { clearError } = slice.actions;
export const {{entityCamelCase}}Reducer = slice.reducer;
