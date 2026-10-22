# Clean Architecture Boundary Rules Matrix

## 1. Import Directionality Matrix

The following table defines allowed and prohibited import directions between layers:

| Origin Layer \ Target Layer | Domain | Infrastructure | DI Container | Presentation ViewModels | Presentation Slices/Thunks | Presentation Hooks | Presentation Components | External Frameworks (React, Next.js, Redux) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Domain** | YES | NO | NO | NO | NO | NO | NO | NO |
| **Infrastructure** | YES | YES | NO | NO | NO | NO | NO | NO (Except pure network/data utilities) |
| **DI Container** | YES | YES | YES | NO | NO | NO | NO | NO |
| **Presentation ViewModels** | YES | NO | NO | YES | NO | NO | NO | NO (Pure string/date formatters only) |
| **Presentation Slices/Thunks** | YES | NO | YES | YES | YES | NO | NO | YES (Redux Toolkit only) |
| **Presentation Hooks** | YES | NO | NO | YES | YES | YES | NO | YES (React, Redux hooks) |
| **Presentation Components** | NO | NO | NO | YES | NO | YES | YES | YES (React, JSX, Tailwind) |

---

## 2. Prohibited Anti-Patterns and Corrective Actions

### Anti-Pattern 1: Leaking React into Domain
- Violation: Importing `useState`, `useEffect`, or JSX in an Entity or Use Case.
- Why It Fails: Breaks portability, unit testability, and framework independence.
- Fix: Domain logic must be pure TypeScript classes and functions.

### Anti-Pattern 2: Presentation Components Calling Infrastructure Directly
- Violation: `RoutineCard` importing `RoutineApiDatasource` or `fetch('/api/routines')`.
- Why It Fails: Bypasses business invariants, use cases, and centralized state.
- Fix: Components must invoke methods from the feature's facade hook (`useRoutines()`).

### Anti-Pattern 3: Visual Components Dispatching Redux Directly
- Violation: `RoutineForm` calling `const dispatch = useAppDispatch(); dispatch(createRoutines(...))`.
- Why It Fails: Tightly couples the visual component to Redux Toolkit mechanics.
- Fix: The component should call an injected prop handler (`onSubmit={createRoutine}`) or use the facade hook.

### Anti-Pattern 4: Raw DTOs Passing into the Domain or Presentation
- Violation: Using API response types directly inside React components or Domain Use Cases.
- Why It Fails: An API schema change immediately breaks UI rendering.
- Fix: Pass DTO through `Mapper.toDomain()` first, then through `ViewModelMapper.toViewModel()` for presentation.

### Anti-Pattern 5: Slices or Thunks Instantiating Repositories Directly
- Violation: In a thunk: `const repo = new RoutineRepositoryImpl(new RoutineApiDatasource());`.
- Why It Fails: Duplicates instantiation and defeats dependency injection.
- Fix: Always import use cases from the DI composition root (`routineContainer.[useCase]`).
