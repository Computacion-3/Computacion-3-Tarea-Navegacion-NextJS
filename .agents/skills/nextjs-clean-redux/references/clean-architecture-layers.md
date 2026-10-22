# Clean Architecture Layers in Frontend Next.js and Redux

## 1. Architectural Foundation and Philosophy

Clean Architecture is not a folder layout or an external library; it is a discipline of dependency inversion and boundary separation. Its fundamental axiom, established by Robert C. Martin and adapted for modern TypeScript frontend applications, asserts that business rules reside at the innermost core of the system, and all external mechanisms (UI frameworks, HTTP protocols, storage engines, state management libraries) are interchangeable adapters that depend inward upon that core, never the reverse.

In this architecture, dependencies point strictly inward across four distinct rings:

1. Domain Layer (Innermost, Pure TypeScript)
2. Infrastructure Layer (External Adapters, Data Sources, Mappers)
3. Dependency Injection Layer (Composition Root)
4. Presentation Layer (State Slices, Thunks, ViewModels, Hooks, and Visual UI)

---

## 2. Domain Layer: The Pure Business Core

The Domain Layer encapsulates the enterprise business models and application business logic. It has zero knowledge of React, Next.js, Redux, DOM elements, or network libraries such as fetch or axios.

### 2.1 Entities (`domain/entities/[entity].ts`)
An Entity models a business concept with a distinct identity, encapsulated attributes, and self-validating invariants that must hold true throughout its entire lifecycle.

Key Rules:
- Implemented as a TypeScript class with `readonly` properties.
- Instantiation enforces business validation in the constructor or a private validate method.
- Throws business errors if invariant rules are violated (e.g., minimum character length, valid value ranges).
- May contain pure domain helper methods (e.g., `hasDescription()`, `isArchived()`).
- Never imports from outside the domain layer.

### 2.2 Repository Contracts (`domain/repositories/[feature].repository.ts`)
The Repository Contract is a pure TypeScript interface defining what business data operations the domain requires, completely decoupled from how or where data is fetched.

Key Rules:
- Defines method signatures returning Domain Entities or primitives inside Promises.
- Defines input parameter types (e.g., `CreateParams`, `FilterParams`).
- Has no awareness of HTTP status codes, JSON wire formats, or storage mechanisms.

### 2.3 Use Cases (`domain/usecases/[action]-[feature].usecase.ts`)
A Use Case represents a single, cohesive business action or user intention within the system.

Key Rules:
- Follows the Single Responsibility Principle: one use case class per business operation (e.g., `GetRoutinesUseCase`, `CreateRoutineUseCase`).
- Receives repository contracts via constructor injection (`private readonly repository: RoutineRepository`).
- Exposes an `execute(...)` method that coordinates domain entities and repositories.
- Applies domain-specific orchestration (e.g., sorting, business calculations, combining entities).

---

## 3. Infrastructure Layer: External Adapters and Data Customs

The Infrastructure Layer communicates with the outside world: REST APIs, NestJS backends, LocalStorage, WebSockets, or mock in-memory datasets.

### 3.1 DTOs (Data Transfer Objects) (`infrastructure/dtos/[feature].dto.ts`)
A DTO is a TypeScript interface that faithfully mirrors the exact JSON structure traveling across the wire:
- Contains API conventions (snake_case, ISO date strings, optional or nullable fields).
- DTOs never enter the domain or UI presentation layer directly.

### 3.2 Datasources (`infrastructure/datasources/[feature]-datasource.interface.ts`)
Datasources isolate the raw network or storage access:
- Interface specifies low-level calls returning DTOs (e.g., `fetchRoutines(): Promise<RoutineResponseDto[]>`).
- Implementations include `[Feature]ApiDatasource` (calling fetch/axios endpoints) and `[Feature]MockDatasource` (in-memory test data).

### 3.3 Mappers (`infrastructure/mappers/[feature].mapper.ts`)
The Mapper functions as an architectural customs inspection office ("Aduana del Mapper"):
- `toDomain(dto: ResponseDto): Entity`: Transforms raw API DTOs into valid Domain Entities, converting string dates to `Date` objects and resolving defaults.
- `toDto(params: DomainParams): RequestDto`: Transforms domain parameters into the wire format expected by the API.

### 3.4 Repository Implementations (`infrastructure/repositories/[feature].repository.impl.ts`)
Concrete class implementing the domain repository interface:
- Injected with a datasource (`private readonly datasource: FeatureDatasource`).
- Invokes datasource methods, applies the Mapper, and returns Domain Entities to satisfy the domain contract.

---

## 4. Dependency Injection (DI) Layer: The Composition Root

Location: `src/features/[feature]/di/[feature].container.ts`

Rather than relying on heavy reflection or runtime decorators, the Composition Root is a functional, strongly-typed singleton container that wires dependencies:
1. Instantiates the chosen concrete datasource (e.g., `RoutineMockDatasource` or `RoutineApiDatasource`).
2. Instantiates the repository implementation passing the datasource.
3. Instantiates use case instances passing the repository.
4. Exports a single container object (e.g., `routineContainer`) consumed by Presentation Thunks.

---

## 5. Presentation Layer: UI, ViewModels, and Redux State

The Presentation Layer translates user actions into business commands and renders state to the screen.

### 5.1 ViewModels and ViewModelMapper (`presentation/viewmodels/[feature].viewmodel.ts`)
Domain entities are shaped for business integrity, not necessarily for UI rendering convenience. The ViewModel represents the exact data structure needed by UI components:
- Formatted dates for locale (e.g., Spanish `es-CO`).
- Humanized strings, badge labels, and computed display flags (e.g., `isRecent`, `hasPendingReview`).
- `ViewModelMapper.toViewModel(entity: Entity): ViewModel`: Pure function converting Domain Entities to ViewModels.

### 5.2 Redux Slices and Asynchronous Thunks (`presentation/slices/[feature].slice.ts`)
Redux Toolkit manages client-side global state:
- Slices manage state attributes: `items: FeatureViewModel[]`, `isLoading: boolean`, `isMutating: boolean`, `errorMessage: string | null`.
- Asynchronous Thunks (`createAsyncThunk`):
  - Created per asynchronous action (e.g., `fetchFeatures`, `createFeature`).
  - Calls Use Cases from the DI container (`featureContainer.getFeatures.execute()`).
  - Converts returned domain entities to ViewModels before dispatching to slice state.
  - Handles errors using `rejectWithValue`.
- `extraReducers`: Handles `pending`, `fulfilled`, and `rejected` states immutably via Immer.

### 5.3 Presenter Facade Hook (`presentation/hooks/use-[feature].ts`)
A custom React hook that encapsulates all Redux mechanics (`useAppDispatch`, `useAppSelector`):
- Exposes clean getters and action triggers to UI components (e.g., `features`, `isLoading`, `createFeature`).
- Shields React components from needing direct knowledge of Redux Toolkit, store structure, or action dispatching.

### 5.4 UI Components (`presentation/components/[Feature]Card.tsx`, `[Feature]Form.tsx`)
Presentational dumb components:
- Receive props and event handlers from parent pages or use the feature facade hook.
- Do not import store hooks or infrastructure directly.
- Purely render markup, styles (Tailwind CSS, DaisyUI), and capture form inputs.

---

## 6. Global Store Foundation

Location: `src/store/`
- `store.ts`: Defines `makeStore()` factory for SSR safety in Next.js, along with `AppStore`, `RootState`, and `AppDispatch` types.
- `StoreProvider.tsx`: Client component holding store instance via `useState<AppStore>(makeStore)` so state is isolated per request on server rendering and stable on the client.
- `hooks.ts`: Strongly typed wrappers `useAppDispatch: () => AppDispatch` and `useAppSelector: TypedUseSelectorHook<RootState>`.
