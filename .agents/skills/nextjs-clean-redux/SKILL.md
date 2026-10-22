---
name: nextjs-clean-redux
description: Guides the design, decomposition, implementation, and boundary auditing of Next.js features using Clean Architecture and Redux Toolkit with Thunks.
category: software-dev
---

# Next.js Clean Architecture with Redux Thunks (`nextjs-clean-redux`)

## Overview

This skill equips the agent to design, inspect, plan, implement, and audit frontend features in Next.js App Router applications following Clean Architecture principles combined with Redux Toolkit and asynchronous Thunks.

The architecture isolates enterprise business logic in a pure TypeScript Domain layer, encapsulates external network and storage protocols inside an Infrastructure layer, wires dependencies via a functional Dependency Injection (DI) Composition Root, manages application state in Redux with Thunks, and keeps React visual components decoupled behind custom facade hooks.

---

## Architectural Principles and Layer Definitions

Before modifying or creating any code, the agent must uphold the following layer definitions and strict boundary rules:

### 1. Domain Layer (`src/features/[feature]/domain/`)
- 100% Pure TypeScript. No React hooks, no Next.js navigation, no Redux dispatch/selectors, no direct fetch or axios calls.
- `entities/`: Class models with `readonly` fields, self-validating invariants in constructors, and pure domain business rules.
- `repositories/`: Repository interfaces declaring abstract data contracts required by business logic.
- `usecases/`: Single-responsibility classes coordinating domain entities and repositories through an `execute(...)` method.

### 2. Infrastructure Layer (`src/features/[feature]/infrastructure/`)
- `dtos/`: TypeScript interfaces representing the exact wire contract from external APIs (snake_case, ISO strings, nullable fields).
- `datasources/`: Datasource interfaces and concrete implementations (API client or mock in-memory stores).
- `mappers/`: Two-way customs inspection office transforming raw DTOs into Domain Entities (`toDomain`) and domain parameters into DTOs (`toDto`).
- `repositories/`: Concrete implementations of domain repository interfaces that query datasources and apply mappers.

### 3. Dependency Injection Layer (`src/features/[feature]/di/`)
- `[feature].container.ts`: Functional Composition Root instantiating concrete datasources, repositories, and use cases, exporting a typed container instance.

### 4. Presentation Layer (`src/features/[feature]/presentation/`)
- `viewmodels/`: UI-ready data structures and `ViewModelMapper` applying locale formatting, display labels, and presentation flags (such as `isRecent`).
- `slices/`: Redux Toolkit `createSlice` managing feature state (`items`, `isLoading`, `isMutating`, `errorMessage`).
- Asynchronous Thunks (`createAsyncThunk`): Orchestrators calling use cases from the DI container, transforming Domain Entities into ViewModels, and dispatching results.
- `hooks/`: Facade custom hook (e.g., `use[Feature]`) wrapping `useAppDispatch` and `useAppSelector`, exposing state and dispatch triggers so UI components do not depend directly on Redux.
- `components/`: Presentational dumb components receiving data and handlers via props.

### 5. Store Foundation (`src/store/`)
- Store factory `makeStore` configured with Redux Toolkit for SSR safety.
- `StoreProvider.tsx` using `useState<AppStore>(makeStore)` to prevent state pollution across server-rendered requests.
- Strongly typed hooks `useAppDispatch` and `useAppSelector`.

Reference documentation is available in:
- `.agents/skills/nextjs-clean-redux/references/clean-architecture-layers.md`
- `.agents/skills/nextjs-clean-redux/references/redux-toolkit-thunks-nextjs.md`
- `.agents/skills/nextjs-clean-redux/references/boundary-rules-matrix.md`

---

## Operational Workflow

When given a new user story, feature requirement, or architectural audit request, execute the following phased workflow in strict sequence:

### Phase 1: Existing Codebase Reuse Audit

Do not assume a feature must be written from scratch. Perform a comprehensive scan of existing features, modules, repositories, use cases, datasources, and store slices:
1. Search `src/features/` for existing entities, use cases, or datasources that can be extended or reused.
2. Check `src/store/store.ts` to inspect registered reducers.
3. Check `scripts/lint-clean-architecture.mjs` status using `npm run lint:clean`.
4. Document all reusable elements or potential collisions before formulating any plan.

### Phase 2: Conversational Boundary Probing

Engage in a conversational open-ended dialogue with the developer to question and clarify architectural intent:
1. Probe domain invariants: What validation rules define the entity? What states are illegal?
2. Probe responsibility boundaries: Which operations belong to the business core (use cases) versus external transport details (infrastructure)?
3. Probe external communication: What API endpoints, DTO contracts, or mock data sources are expected?
4. Probe presentation needs: What formatting, locale-specific transformations, or badge indicators are required by the ViewModels?
5. Probe state management: Does this state need to be global in Redux or scoped locally?

### Phase 3: Actionable Implementation Planning

Once requirements and boundaries are established:
1. Decompose the requirement into an implementation plan following the template at `.agents/skills/nextjs-clean-redux/templates/plan.template.md`.
2. Save the generated plan to `temp/plan-[feature-slug].md`.
3. Display the plan clearly to the user, highlighting the layer separation, reusable components, and task checklist.

### Phase 4: Mandatory User Confirmation Gate

CRITICAL GATE: Do not create any domain, infrastructure, or presentation code until the user explicitly approves the plan by typing `"proceder"` (or explicit confirmation).

If the user requests adjustments, update `temp/plan-[feature-slug].md` and present the revised plan for approval.

### Phase 5: Subagent Delegation for Implementation

Once the plan is approved with `"proceder"`:
1. The planning agent delegates the code writing to an implementation subagent with lower effort (Model: `flash`) to optimize token usage while adhering strictly to the plan.
2. The subagent follows the sequence demarcated in `temp/plan-[feature-slug].md`:
   - Step 1: Domain Entities and Invariant validations (`domain/entities/`).
   - Step 2: Domain Repository interface and Use Cases (`domain/repositories/`, `domain/usecases/`).
   - Step 3: Infrastructure DTOs, Datasource, Mapper, and Repository Implementation (`infrastructure/`).
   - Step 4: DI Composition Root (`di/`).
   - Step 5: Presentation ViewModels and `ViewModelMapper` (`presentation/viewmodels/`).
   - Step 6: Redux Slice and Asynchronous Thunks (`presentation/slices/`).
   - Step 7: Store registration in `src/store/store.ts`.
   - Step 8: Facade custom hook (`presentation/hooks/`).
   - Step 9: Presentational UI Components and App Router Page (`presentation/components/`, `app/[feature]/page.tsx`).
3. Templates for each layer artifact are located in `.agents/skills/nextjs-clean-redux/templates/`.

### Phase 6: Architectural Audit and Quality Verification

After code generation completes, execute the following verification steps:
1. Run the clean architecture linter:
   `npm run lint:clean`
   Verify that zero architectural violations are reported.
2. Run TypeScript compilation:
   `npx tsc --noEmit`
   Verify that all types, imports, and DI bindings are strictly typed and error-free.
3. If violations or compiler errors are reported, correct the import paths or boundaries immediately and re-run both commands until all checks pass cleanly.
