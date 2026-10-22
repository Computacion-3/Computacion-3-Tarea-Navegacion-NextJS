'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { create{{EntityName}}, fetch{{EntityNamePlural}} } from '../slices/{{entity-slug}}.slice';
import { Create{{EntityName}}Params } from '../../domain/repositories/{{entity-slug}}.repository';

export function use{{EntityNamePlural}}() {
    const dispatch = useAppDispatch();
    const { items, isLoading, isMutating, errorMessage } = useAppSelector(
        (state) => (state as any).{{entityCamelCasePlural}}
    );

    useEffect(() => {
        dispatch(fetch{{EntityNamePlural}}());
    }, [dispatch]);

    const createItem = async (params: Create{{EntityName}}Params) => {
        const result = await dispatch(create{{EntityName}}(params));
        return create{{EntityName}}.fulfilled.match(result);
    };

    return {
        items,
        isLoading,
        isMutating,
        errorMessage,
        createItem,
    };
}
