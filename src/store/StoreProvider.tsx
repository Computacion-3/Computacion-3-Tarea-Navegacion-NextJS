'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

/**
 * Proveedor de Redux para Next.js App Router.
 * 
 * ¿Por qué 'use client'?
 * Redux utiliza el React Context API internamente, lo cual solo está disponible
 * en Client Components.
 * ¿Por qué useState(makeStore)?
 * Garantiza que la instancia del store se cree exactamente una vez durante el ciclo
 * de vida del cliente y permanezca estable sin reinicializarse en cada render.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState<AppStore>(makeStore);

    return <Provider store={store}>{children}</Provider>;
}
