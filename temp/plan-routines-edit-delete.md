# Implementation Plan: Borrar y Editar Rutina (Clean Architecture + Redux)

## 1. Feature Overview and Requirement Analysis
- User Story / Requirement: Como usuario del sistema de entrenamiento, quiero poder editar los datos de una rutina existente (nombre y descripción) y eliminar una rutina que ya no necesite, para mantener actualizado mi plan de entrenamiento.
- Feature Identifier: `routines`

## 2. Existing Code Audit and Reusability Findings
- Reusable Modules / Use Cases:
  - Entidad de dominio `Routine` (`src/features/routines/domain/entities/routine.ts`) con validaciones de invariantes para `name` (3-100 caracteres) y `description` (opcional, mínimo 10 caracteres).
  - Repositorio base `RoutineRepository` (`src/features/routines/domain/repositories/routine.repository.ts`).
  - Datasource en memoria `RoutineMockDatasource` (`src/features/routines/infrastructure/datasources/routine-mock-datasource.ts`) con array mutable `routines`.
  - Mappers existentes `RoutineMapper` y `RoutineViewModelMapper`.
  - Slice existente `routine.slice.ts` con estado de mutación `isMutating` y manejo de errores.
  - Facade hook `useRoutines` en `src/features/routines/presentation/hooks/use-routines.ts`.
  - Componentes visuales `RoutineCard.tsx` y página `app/routines-clean/page.tsx`.
- Conflicts or Duplications Detected:
  - Ninguno. La funcionalidad extenderá de forma cohesiva la feature `routines` existente sin romper contratos previos.
  - Corrección menor identificada: En `use-routines.ts`, asegurar que `dispatch` sea esperado con `await` antes de evaluar `fulfilled.match(result)`.

## 3. Layer Separation Strategy
- Domain Layer:
  - Entities:
    - Extender `Routine` con método de clonación/actualización con invariantes `update(name: string, description?: string): Routine`.
  - Invariants and Business Validations:
    - Se mantienen y aplican las mismas validaciones de negocio en la edición (nombre >= 3 caracteres, descripción opcional >= 10 caracteres).
    - Un ID no puede ser modificado y debe ser un número entero positivo válido.
  - Repository Contracts:
    - Añadir a `RoutineRepository`:
      - `update(params: UpdateRoutineParams): Promise<Routine>`
      - `delete(id: number): Promise<void>`
  - Use Cases:
    - Crear `UpdateRoutineUseCase` en `src/features/routines/domain/usecases/update-routine.usecase.ts`.
    - Crear `DeleteRoutineUseCase` en `src/features/routines/domain/usecases/delete-routine.usecase.ts`.
- Infrastructure Layer:
  - DTOs:
    - Crear `UpdateRoutineDto` en `src/features/routines/infrastructure/dtos/routine.dto.ts`.
  - Datasources (API / Mock):
    - Añadir a `RoutineDatasource`:
      - `updateRoutine(id: number, dto: UpdateRoutineDto): Promise<RoutineResponseDto>`
      - `deleteRoutine(id: number): Promise<void>`
    - Implementar ambos métodos en `RoutineMockDatasource` simulando latencia de red (`delay(600)`), actualizando/eliminando del array en memoria y lanzando error si la rutina no existe.
  - Mappers:
    - Añadir en `RoutineMapper`: `toUpdateDto(params: UpdateRoutineParams): UpdateRoutineDto`.
  - Repository Implementations:
    - Extender `RoutineRepositoryImpl` con `update` y `delete`.
- Dependency Injection (Composition Root):
  - Container file: `src/features/routines/di/routine.container.ts`
  - Instanciar `updateRoutine: new UpdateRoutineUseCase(routineRepository)` y `deleteRoutine: new DeleteRoutineUseCase(routineRepository)`.
- Presentation & State Management:
  - ViewModels & Formats:
    - `RoutineItemViewModel` existente es suficiente para visualización.
  - Redux Slice: `src/features/routines/presentation/slices/routine.slice.ts`
    - Thunk `updateRoutine`: orquesta `updateRoutine.execute`, mapea entidad a ViewModel y actualiza el item en `state.items`.
    - Thunk `deleteRoutine`: orquesta `deleteRoutine.execute` y remueve el item por ID de `state.items`.
    - Reducers manejan estados de `isMutating` y `errorMessage`.
  - Facade Hook: `src/features/routines/presentation/hooks/use-routines.ts`
    - Exponer `updateRoutine: (params: UpdateRoutineParams) => Promise<boolean>`.
    - Exponer `deleteRoutine: (id: number) => Promise<boolean>`.
  - Visual UI Components:
    - `RoutineCard.tsx`: Añadir botones "Editar" y "Eliminar" con confirmación y modo de edición interactivo (o modal/formulario inline).
    - Modal o formulario de edición `EditRoutineModal.tsx` desacoplado y sin dependencias directas de Redux (utiliza props/callbacks).
    - `app/routines-clean/page.tsx`: Conectar las acciones a través de `useRoutines()`.
- Store Registration:
  - Ya se encuentra registrado `routines: routineReducer` en `src/store/store.ts`.

## 4. Step-by-Step Task Decomposition for Subagent
1. Task 1: Domain Layer - Actualizar `Routine` (método `update`), contrato en `routine.repository.ts` (`UpdateRoutineParams`, `update`, `delete`).
2. Task 2: Domain Layer - Crear `update-routine.usecase.ts` y `delete-routine.usecase.ts`.
3. Task 3: Infrastructure Layer - Actualizar DTOs (`UpdateRoutineDto`), contrato `RoutineDatasource`, implementación en `RoutineMockDatasource`, mapper `RoutineMapper.toUpdateDto`, y `RoutineRepositoryImpl`.
4. Task 4: DI Container - Registrar `updateRoutine` y `deleteRoutine` en `routine.container.ts`.
5. Task 5: Presentation Slices - Añadir thunks `updateRoutine` y `deleteRoutine` con sus respectivos `extraReducers` en `routine.slice.ts`.
6. Task 6: Presentation Hook - Exponer `updateRoutine` y `deleteRoutine` en el facade hook `use-routines.ts`.
7. Task 7: Presentation Components - Actualizar `RoutineCard.tsx` e implementar modal o formulario de edición (`EditRoutineModal.tsx`) con diseño DaisyUI accesible y confirmación de eliminación.
8. Task 8: Presentation Page - Integrar las operaciones en `app/routines-clean/page.tsx`.
9. Task 9: Quality Verification - Ejecutar `npm run lint:clean` para garantizar 0 violaciones de capas y `npx tsc --noEmit` para verificar tipos.

## 5. Status
- Plan Status: COMPLETED
- Verification: PASSED (npm run lint:clean - 0 violations, npx tsc --noEmit - 0 errors)
