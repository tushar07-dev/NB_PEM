# GitHub Copilot Instructions — NB_PEM

> **Living document.** Update this file whenever new patterns, libraries, or conventions are introduced.  
> Last updated: February 2026

---

## Project Summary

**NB_PEM** (PEM Digital) is a React 18 + TypeScript enterprise application for document checklist management with authentication, role-based access, and advanced data handling.

| Concern | Tool |
|---|---|
| Build | Vite |
| UI | shadcn/ui + Radix UI + Tailwind CSS |
| State | Zustand + React Context/Hooks |
| Routing | React Router v6 |
| Data Fetching | TanStack Query (React Query) |
| HTTP Client | Axios (with interceptors) |
| Auth | MSAL — Azure AD *(currently commented out)* |
| Forms | react-hook-form + zod |
| Testing | Jest + React Testing Library + MSW |
| Package Manager | pnpm |

---

## Key Paths

| Path | Purpose |
|---|---|
| `src/main.tsx` | App entry point |
| `src/app/router` | Route definitions |
| `src/app/providers` | Global providers (auth, query, theme) |
| `src/features/*` | Feature modules |
| `src/shared/components/ui` | shadcn/ui primitives |
| `src/shared/components/data-table` | Reusable data table system |
| `src/shared/hooks` | Shared custom hooks |
| `src/shared/store` | Zustand stores |
| `src/shared/services/axios.ts` | Axios API client |
| `src/shared/config/configService.ts` | Environment config |

---

## Project Structure

```
src/
  app/
    providers/
    router/
  features/
    feature-name/
      api/            # API functions
      components/     # Feature UI components
      constants/      # Query keys, enums
      hooks/
        query/        # useQuery hooks
        mutation/     # useMutation hooks
      pages/          # Route-level page components
      types/          # TypeScript types/interfaces
      utils/          # Feature-specific helpers
  shared/
    components/
      ui/             # shadcn/ui components
      data-table/     # Table system (see below)
    config/
    constants/
    errors/
    hooks/
    lib/
    services/
    store/
    types/
    utils/
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `DocumentChecklist.tsx` |
| Hooks | camelCase + `use` prefix | `useAsyncError.ts` |
| Services / utils | camelCase | `authService.ts`, `dateUtils.ts` |
| Feature folders | lowercase-hyphenated | `document-checklist` |
| File names | lowercase-hyphenated | `api.ts`, `client.ts` |
| Interfaces | PascalCase + `I` prefix | `ICreateChecklistPayload` |
| Types | PascalCase + `T` prefix | `TChecklist`, `TGetAllChecklistsResponse` |
| API functions | `[action][Feature]Api` | `createChecklistApi` |
| Query hooks | `useGetAll[Feature]`, `useGet[Feature]ById` | `useGetAllChecklists` |
| Mutation hooks | `useCreate[Feature]`, `useUpdate[Feature]`, `useDelete[Feature]` | `useCreateChecklist` |

---

## Component Pattern

```tsx
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function ComponentName({ title, onAction }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState(false);

  // 2. Effects
  useEffect(() => {
    // side effects
  }, []);

  // 3. Handlers
  const handleClick = () => onAction();

  // 4. Early returns
  if (loading) return <SkeletonCard />;
  if (error) return <ErrorFallback error={error} />;

  // 5. Render
  return (
    <div className="component-container">
      <Button onClick={handleClick}>{title}</Button>
    </div>
  );
}
```

**Rules:**
- Always define a TypeScript interface for props — no inline prop types
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- Always handle loading and error states
- Never use `any` — use proper types or `unknown`

---

## API Integration

### File location
`src/features/[feature]/api/[feature].ts`

### API function pattern

```typescript
import { api } from "@/shared/services/axios";
import { TSuccessResponse } from "@/shared/types/api/response";
import { toQueryString } from "@/shared/utils/helpers";
import { ICreateChecklistPayload, TGetAllChecklistsResponse } from "../types/api";

export const createChecklistApi = async (
  payload: ICreateChecklistPayload
): Promise<TSuccessResponse<TCreateChecklistResponse>> => {
  const { data } = await api.post("/api/Checklist/CreateChecklist", payload);
  return data;
};

export const getAllChecklistsApi = async (
  payload: TGetAllChecklistsPayload
): Promise<TSuccessResponse<TGetAllChecklistsResponse>> => {
  const { data } = await api.get(`/api/Checklist/GetAll?${toQueryString(payload)}`);
  return data;
};

export const exportChecklistExcelApi = async (
  payload: TExportChecklistPayload
): Promise<Blob> => {
  const { data } = await api.get(
    `/api/Checklist/Export?${toQueryString(payload)}`,
    { responseType: "blob" }
  );
  return data;
};
```

### API response format (all endpoints)
```typescript
{
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}
```

---

## Type Definitions

File: `src/features/[feature]/types/api.ts`

```typescript
import { TPaginationPayload, TTableQueryPayload } from "@/shared/types/api/payload";
import { TPaginationResponse } from "@/shared/types/api/response";

// Payloads — use I prefix
export interface ICreateChecklistPayload {
  name: string;
  description: string;
  isActive: boolean;
  projectId: string;
}

export interface IUpdateChecklistPayload extends ICreateChecklistPayload {
  checklistId: string;
}

// Single response type
export interface TGetChecklistByIdResponse {
  checklistId: string;
  name: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
}

// List item type
export type TChecklist = Pick<TGetChecklistByIdResponse, "checklistId" | "name" | "isActive">;

// Paginated list payload
export type TGetAllChecklistsPayload = TPaginationPayload &
  Partial<TTableQueryPayload> & {
    projectId?: string | null;
  };

// Paginated list response
export type TGetAllChecklistsResponse = TPaginationResponse & {
  data: TChecklist[];
};
```

---

## React Query Hooks

### Query constants — `src/features/[feature]/constants/query.ts`
```typescript
export const GET_ALL_CHECKLISTS = "GET_ALL_CHECKLISTS";
export const GET_CHECKLIST_BY_ID = "GET_CHECKLIST_BY_ID";
```

### Query hook — `src/features/[feature]/hooks/query/[feature].ts`
```typescript
export const useGetAllChecklists = (payload: TUseGetAllChecklists) => {
  const formatted = formatFilterSortPayload(payload);

  return useQuery({
    queryKey: [GET_ALL_CHECKLISTS, payload.pageSize, payload.pageNumber, formatted, payload.projectId],
    queryFn: async () => {
      const res = await getAllChecklistsApi({ ...formatted, ...payload });
      return {
        data: res?.data?.data ?? [],
        meta: {
          totalRowCount: res?.data?.totalRecords ?? 0,
          page: res?.data?.pageNumber ?? 1,
          pageSize: payload.pageSize,
        },
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: payload.enabled ?? true,
  });
};
```

### Mutation hook — `src/features/[feature]/hooks/mutation/[feature].ts`
```typescript
export const useCreateChecklist = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateChecklistPayload) => createChecklistApi(payload),
    onSuccess: (data) => {
      const ok = handleSuccessApiToast(data);
      if (ok) {
        onSuccess?.();
        queryClient.invalidateQueries({ queryKey: [GET_ALL_CHECKLISTS] });
      }
    },
    onError: (error) => {
      const { msg } = getMutationErrorMsg(error);
      toast.error(msg);
    },
  });
};
```

### staleTime guidelines
| Data type | staleTime |
|---|---|
| Single item (form edit) | `0` |
| List data | `5 * 60 * 1000` (5 min) |
| Dropdowns / static | `10 * 60 * 1000` (10 min) |

---

## Data Table System

| Layer | File |
|---|---|
| Store (per-table state) | `src/shared/store/tableStore.ts` |
| Hook (binds store to TanStack Table) | `src/shared/hooks/data-table/use-data-table.ts` |
| UI renderer | `src/shared/components/data-table/data-table.tsx` |
| Column factories | `src/shared/components/data-table/column/*` |

- Pagination, sorting, and filtering are **server-driven** by default
- Filters/sorts update Zustand state; page resets on filter changes
- Column `meta` controls filter variants and display labels

---

## State Management (Zustand)

```typescript
// src/shared/store/[store].ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistStore {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  devtools(
    (set) => ({
      selectedIds: [],
      setSelectedIds: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),
    }),
    { name: "checklist-store" }
  )
);
```

- Use `persist` only when state must survive page refresh
- Use `partialize` in persist to limit what gets saved to storage
- Feature stores go in `src/shared/store/` (global) or feature's own store if truly isolated

---

## Forms

```typescript
const schema = z.object({
  name: z.string().min(1, "Required"),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function ChecklistForm({ onSubmit }: { onSubmit: (d: FormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} />
      {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      <Button type="submit">Save</Button>
    </form>
  );
}
```

---

## Error Handling

```typescript
// Wrap pages in error boundaries
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

// Async errors in components
import { useAsyncError } from "@/shared/hooks/useAsyncError";
const throwError = useAsyncError();
try { await riskyOp(); } catch (e) { throwError(e); }

// Centralized API errors
import { handleApiError } from "@/shared/utils/errors/errorHandler";
```

- Every route-level page must be wrapped in `<ErrorBoundary>`
- Use `toast.error()` (sonner) for user-facing mutation errors
- Never swallow errors silently

---

## Styling Rules

**Decision order:**
1. Theme colors, design tokens → **CSS variables** (`hsl(var(--background))`)
2. Simple/one-off layout → **Tailwind in TSX**
3. Reusable/complex styles → **CSS class**
4. Never duplicate a style in both CSS and TSX

| Rule | Where |
|---|---|
| Theme colors, font families, letter spacing | CSS |
| Keyframe animations, pseudo-elements | CSS |
| One-off spacing, flex, grid utilities | Tailwind TSX |
| Simple transitions | Tailwind TSX |

---

## TypeScript Rules

- Strict mode always on
- No `any` — use `unknown` and narrow, or define a proper type
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `NonNullable<T>`
- API date fields → `string` (ISO); convert to `Date` only in components

---

## Authentication

```tsx
import { useAuth } from "@/app/providers/useAuth";

function ProtectedComponent() {
  const { currentUser, authToken, login, logout } = useAuth();
  if (!currentUser) return <LoginPage />;
  return <div>Protected content</div>;
}
```

MSAL config lives in `src/shared/config/msalConfig.ts`. Enable by uncommenting the provider in `src/app/providers`.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_AZURE_CLIENT_ID` | Azure AD client ID |
| `VITE_AZURE_TENANT_ID` | Azure AD tenant ID |
| `VITE_ENVIRONMENT` | `development` / `staging` / `production` |
| `VITE_APP_VERSION` | App version string |

- Never commit `.env` files — use `.env.example` for documentation
- Config validation happens in `configService.ts` — fail fast on missing required vars

---

## Testing (Vitest)

> **Before writing or modifying any logic in a component or hook — check if a `.test.tsx` / `.test.ts` file already exists for it. If it does, read it first to understand the expected behavior, then choose an approach that keeps existing tests passing or consciously updates them.**

### Stack
- **Test runner:** Vitest
- **Component testing:** React Testing Library
- **API mocking:** MSW v2
- **Assertions:** Vitest built-ins (`expect`, `vi`)

### File Conventions
| What | Location | Name |
|---|---|---|
| Component test | Next to component | `ComponentName.test.tsx` |
| Hook test | Next to hook | `useHookName.test.ts` |
| Util test | Next to util | `utilName.test.ts` |
| Shared mocks | `src/mocks/` | `server.ts`, `handlers.ts` |

---

### Basic Component Test

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChecklistCard } from "./ChecklistCard";

describe("ChecklistCard", () => {
  it("renders checklist name", () => {
    render(<ChecklistCard name="Safety Check" isActive={true} />);
    expect(screen.getByText("Safety Check")).toBeInTheDocument();
  });

  it("shows inactive badge when isActive is false", () => {
    render(<ChecklistCard name="Old Check" isActive={false} />);
    expect(screen.getByText(/inactive/i)).toBeInTheDocument();
  });
});
```

---

### API Mock with MSW v2

```typescript
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { ChecklistList } from "./ChecklistList";

describe("ChecklistList", () => {
  it("renders items from API", async () => {
    server.use(
      http.get("/api/Checklist/GetAll", () =>
        HttpResponse.json({
          success: true,
          data: { data: [{ checklistId: "1", name: "Safety" }], totalRecords: 1 },
        })
      )
    );

    render(<ChecklistList />);

    await waitFor(() =>
      expect(screen.getByText("Safety")).toBeInTheDocument()
    );
  });

  it("shows empty state when no data", async () => {
    server.use(
      http.get("/api/Checklist/GetAll", () =>
        HttpResponse.json({ success: true, data: { data: [], totalRecords: 0 } })
      )
    );

    render(<ChecklistList />);
    await waitFor(() =>
      expect(screen.getByText(/no results/i)).toBeInTheDocument()
    );
  });
});
```

---

### Custom Hook Test

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCreateChecklist } from "./useCreateChecklist";

describe("useCreateChecklist", () => {
  it("calls onSuccess after successful mutation", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateChecklist(onSuccess), {
      wrapper: QueryClientWrapper, // wrap with QueryClientProvider
    });

    await act(async () => {
      result.current.mutate({ name: "New Check", isActive: true, projectId: "p1", description: "" });
    });

    expect(onSuccess).toHaveBeenCalledOnce();
  });
});
```

---

### Mocking Modules and Functions

```typescript
import { vi } from "vitest";

// Mock a module
vi.mock("@/shared/services/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock a function with a return value
vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: [] } });

// Spy on a function
const toastSpy = vi.spyOn(toast, "error");
expect(toastSpy).toHaveBeenCalledWith("Something went wrong");

// Reset mocks between tests
afterEach(() => vi.clearAllMocks());
```

---

### Vitest Config Reference (`vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/mocks/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["src/mocks/**", "**/*.d.ts"],
    },
  },
});
```

---

### MSW Server Setup (`src/mocks/server.ts`)

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

```typescript
// src/mocks/setup.ts
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### Rules & Guidelines

- **Always check for existing tests before changing logic.** If a test file exists, read it first — understand what's covered, then update tests alongside code changes.
- Never delete existing tests without a clear reason — update them to match new behavior instead.
- Use `vi.fn()` for callbacks, `vi.spyOn()` for module methods — never mock entire components.
- Wrap components that use React Query or Zustand in the appropriate provider wrapper in tests.
- Prefer `userEvent` over `fireEvent` for simulating real user interactions.
- Test **behavior**, not implementation — assert what the user sees, not internal state.
- Use `waitFor` for any async rendering or data fetching assertions.
- Group related tests under `describe` blocks matching the component/hook name.

### What to Test
| Layer | What to cover |
|---|---|
| Components | Renders correctly, handles loading/error/empty states, user interactions |
| Query hooks | Returns correct data shape, handles API errors |
| Mutation hooks | Calls API, triggers `onSuccess`, shows error toast on failure |
| Utils | Edge cases, null/undefined input, expected output |

### Commands
```bash
pnpm test               # Run all tests
pnpm test:watch         # Watch mode
pnpm test:coverage      # Coverage report
pnpm test src/features/document-checklist  # Run tests for one feature
```

---

## Performance

- `React.memo` for components that receive stable props but re-render often
- `React.lazy` + `Suspense` for all route-level components
- `useMemo` for expensive derived values; `useCallback` for handlers passed to children
- `react-window` or `react-virtualized` for tables/lists with 100+ rows
- Monitor bundle size — run `pnpm build --report` periodically

---

## Security

- Validate all user input at form boundaries (Zod)
- No sensitive data in `localStorage` (tokens managed by MSAL)
- HTTPS for all API calls
- Sanitize data before rendering (avoid `dangerouslySetInnerHTML`)
- CSP headers configured at the server/CDN level

---

## Accessibility

- All interactive elements have `aria-label` or visible label
- Keyboard navigation works for all modals, dropdowns, forms
- Sufficient color contrast (WCAG AA minimum)
- Focus indicators always visible
- Use `role` attributes only when semantic HTML isn't possible

---

## Common Commands

```bash
pnpm dev              # Dev server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm type-check       # TypeScript check
```

---

## Adding a New Feature — Checklist

```
src/features/[feature-name]/
  api/[feature].ts          ← API functions
  components/               ← UI components
  constants/query.ts        ← Query key constants
  hooks/
    query/[feature].ts      ← useQuery hooks
    mutation/[feature].ts   ← useMutation hooks
  pages/[Feature]Page.tsx   ← Route page component
  types/api.ts              ← All types/interfaces
  utils/                    ← Feature helpers (if needed)
```

Steps:
1. Create folder structure above
2. Define types in `types/api.ts` first
3. Write API functions in `api/[feature].ts`
4. Write query/mutation hooks
5. Build components and page
6. Add route in `src/app/router`
7. Write tests
8. Update this file if new patterns are introduced

---

## Code Review Checklist

- [ ] TypeScript strict — no `any`, all props typed
- [ ] Loading and error states handled
- [ ] Error boundary wrapping page-level components
- [ ] Query keys include all relevant params
- [ ] Mutations invalidate related queries
- [ ] Responsive design with Tailwind breakpoints
- [ ] Accessibility — ARIA, keyboard nav, semantic HTML
- [ ] Tests written for new logic
- [ ] No secrets or hardcoded URLs committed
- [ ] This file updated if new patterns introduced