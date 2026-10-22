# Redux Toolkit and Thunks in Next.js App Router

## 1. The SSR Challenge in Next.js

In traditional Single Page Applications (SPAs), the Redux store is created once as a global singleton:
```typescript
// Avoid in Next.js App Router:
export const store = configureStore({ ... });
```
In Next.js App Router (which executes React Server Components and Server-Side Rendering), creating a global singleton store causes cross-request state pollution: one user's state could leak into another user's rendered HTML.

## 2. Store Factory Pattern (`makeStore`)

To ensure SSR safety, the Redux store must be initialized per request on the server and once per component lifecycle on the client:

```typescript
// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { routineReducer } from "../features/routines/presentation/slices/routine.slice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            routines: routineReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
```

## 3. StoreProvider with Client Stability

The `StoreProvider` must be marked with `"use client"` and hold the store instance using React's `useState` hook initializer to prevent recreating the store on client re-renders:

```tsx
// src/store/StoreProvider.tsx
"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [store] = useState<AppStore>(makeStore);
    return <Provider store={store}>{children}</Provider>;
}
```

## 4. Asynchronous Thunk Pattern with Clean Architecture

Redux Thunks act as the orchestration gateway between Redux state and the Clean Architecture use cases in the DI container.

### 4.1 Thunk Execution Flow
1. UI triggers an action through the feature facade hook (`createRoutine(params)`).
2. The hook dispatches the async thunk (`dispatch(createRoutines(params))`).
3. Inside the thunk, `routineContainer.[usecase].execute(params)` is called.
4. The use case returns a pure Domain Entity.
5. The thunk maps the Domain Entity into a View Model via `RoutineViewModelMapper.toViewModel(domainEntity)`.
6. The thunk returns the ViewModel, which flows into `slice.extraReducers` under `fulfilled`.

### 4.2 Error Handling with `rejectWithValue`
Thunks should catch domain or network errors and pass human-readable messages to Redux state:

```typescript
export const fetchRoutines = createAsyncThunk(
    "routines/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const domainEntities = await routineContainer.getRoutines.execute();
            return domainEntities.map((entity) =>
                RoutineViewModelMapper.toViewModel(entity)
            );
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unexpected error";
            return rejectWithValue(message);
        }
    }
);
```

## 5. Typed Redux Hooks

Always access Redux dispatch and selector via pre-typed hooks:

```typescript
// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
