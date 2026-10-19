import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// Hooks tipados para usar en toda la aplicación en lugar de los hooks genéricos de react-redux (`useDispatch` y `useSelector`).
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
