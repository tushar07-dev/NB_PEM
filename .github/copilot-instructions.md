# GitHub Copilot Instructions for NB_PEM Project

## Project Overview

This is a React TypeScript application called "NB_PEM" (PEM Digital) built with modern web technologies. It's a document checklist management system with authentication, role-based access, and various features for managing checklists and documents.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **State Management**: Zustand + React hooks and context
- **Routing**: React Router v6
- **Authentication**: Microsoft Authentication Library (MSAL) for Azure AD (But currently commented out)
- **HTTP Client**: Axios with interceptors
- **Data Fetching**: TanStack Query (React Query)
- **Testing**: Jest with React Testing Library
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand
- **Linting**: ESLint
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Forms**: Custom form components with validation
- **Error Handling**: Error boundaries and custom error hooks
- **Data Fetching**: TanStack Query (React Query)

## Coding Standards

### File Naming

- Components: PascalCase (e.g., `DocumentChecklist.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAsyncError.ts`)
- Services: camelCase (e.g., `authService.ts`)
- Types: PascalCase with descriptive names (e.g., `ChecklistItem.ts`)
- Utilities: camelCase (e.g., `dateUtils.ts`)
- Feature Folders: Use lowercase with hyphens (e.g., `document-checklist`, `auth`)
- File Names: Use lowercase with hyphens (e.g., `client.ts`, `api.ts`)

### Component Structure

```tsx
// Preferred component structure
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";

interface ComponentProps {
  // Define props interface
}

export function ComponentName({ prop }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState(initialValue);

  // Effects after hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleAction = () => {
    // Handler logic
  };

  // Early returns for loading/error states
  if (loading) return <SkeletonCard />;
  if (error) return <ErrorFallback error={error} />;

  return (
    // JSX with semantic HTML
    <div className="component-container">{/* Component content */}</div>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS classes with shadcn/ui design tokens
- Prefer HSL color variables: `hsl(var(--background))`, `hsl(var(--foreground))`
- Use responsive design for laptop and monitor screens
- Utilize utility-first classes for layout and spacing
- Follow shadcn/ui component patterns
- Maintain consistent spacing using Tailwind spacing scale

### TypeScript Best Practices

- Use strict type checking
- Define interfaces for component props and data structures
- Avoid `any` type - use proper type definitions
- Use union types for variant props
- Leverage utility types like `Partial<T>`, `Pick<T>`, etc.

## Project Structure

### Feature Organization

```
src/features/
  feature-name/
    components/     # UI components specific to the feature
    hooks/         # Custom hooks for the feature
    pages/         # Page components
    services/      # API calls and business logic
    types/         # TypeScript interfaces
    utils/         # Feature-specific utilities
```

### Shared Resources

```
src/shared/
  components/     # Reusable UI components
    ui/          # shadcn/ui components
  config/        # Configuration files
  constants/     # Application constants
  errors/        # Error handling components
  hooks/         # Shared custom hooks
  lib/           # Utility libraries
  services/      # Shared services (auth, logging, etc.)
  store/         # Global state management
  utils/         # Shared utility functions
```

## Common Patterns

### API Integration

```tsx
// Use the shared axios instance
import { api } from "@/shared/services/axios";

// Service functions
export const checklistService = {
  async getChecklists() {
    const response = await api.get("/checklists");
    return response.data;
  },

  async createChecklist(data: CreateChecklistData) {
    const response = await api.post("/checklists", data);
    return response.data;
  },
};
```

### Error Handling

```tsx
// Use ErrorBoundary for component-level errors
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

// Use error hooks for async operations
import { useAsyncError } from "@/shared/hooks/useAsyncError";

function MyComponent() {
  const throwError = useAsyncError();

  const handleAsyncOperation = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      throwError(error);
    }
  };
}
```

### Authentication

```tsx
// Use the auth context
import { useAuth } from "@/app/providers/useAuth";

function ProtectedComponent() {
  const { currentUser, authToken, login, logout } = useAuth();

  if (!currentUser) {
    return <LoginPage />;
  }

  return <div>Protected content</div>;
}
```

### Testing

```tsx
// Component testing with RTL
import { render, screen, fireEvent } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Updated text")).toBeInTheDocument();
  });
});
```

## Development Workflow

### Adding New Features

1. Create feature directory under `src/features/`
2. Implement components, hooks, and services
3. Add TypeScript types
4. Write tests
5. Update routing if needed
6. Test integration with existing features

### Component Creation Checklist

- [ ] Define TypeScript interface for props
- [ ] Add proper error handling
- [ ] Include loading states with SkeletonCard
- [ ] Use semantic HTML elements
- [ ] Implement responsive design
- [ ] Add accessibility attributes (aria-labels, roles)
- [ ] Write unit tests
- [ ] Follow naming conventions

### Code Review Guidelines

- Ensure TypeScript strict mode compliance
- Check for proper error handling
- Verify responsive design implementation
- Confirm accessibility standards
- Review test coverage
- Validate API integration patterns

## Performance Considerations

- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Lazy load route components
- Optimize images and assets
- Use virtualization for large lists
- Monitor bundle size

## Security Best Practices

- Validate all user inputs
- Use HTTPS for all API calls
- Implement proper authentication checks
- Avoid storing sensitive data in localStorage
- Sanitize data before rendering
- Use Content Security Policy headers

## Useful Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Testing
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix ESLint issues
pnpm type-check   # Run TypeScript type checking
```

## Common Issues & Solutions

### Build Errors

- Check for missing imports or type errors
- Ensure all dependencies are installed with `pnpm install`
- Verify environment variables are set correctly

### Runtime Errors

- Check browser console for detailed error messages
- Verify API endpoints are accessible
- Confirm authentication tokens are valid

### Styling Issues

- Use browser dev tools to inspect elements
- Check Tailwind classes are applied correctly
- Verify CSS custom properties are defined

Remember to always test your changes thoroughly and follow the established patterns in the codebase. When in doubt, look at existing components for reference implementations.

### API Development Guidelines

When Creating API Files
When I provide a cURL command or API documentation screenshot, follow this standard pattern:

1. **API Function Structure** (in `src/features/[feature]/api/[feature].ts`)

```typescript
// Example pattern based on client.ts and tag.ts

import { api } from "@/shared/services/axios";
import { TSuccessResponse } from "@/shared/types/api/response";
import { toQueryString } from "@/shared/utils/helpers";
import {
  ICreateChecklistPayload,
  IUpdateChecklistPayload,
  TGetAllChecklistsResponse,
  TGetChecklistByIdResponse,
} from "@/features/document-checklist/types/api";

// CREATE
export const createChecklistApi = async (
  payload: ICreateChecklistPayload
): Promise<TSuccessResponse<TCreateChecklistResponse>> => {
  const data = await api.post("/api/Checklist/CreateChecklist", payload);
  return data?.data;
};

// UPDATE
export const updateChecklistApi = async (
  payload: IUpdateChecklistPayload
): Promise<TSuccessResponse<null>> => {
  const data = await api.put("/api/Checklist/UpdateChecklist", payload);
  return data?.data;
};

// GET ALL (with filters/pagination)
export const getAllChecklistsApi = async (
  payload: TGetAllChecklistsPayload
): Promise<TSuccessResponse<TGetAllChecklistsResponse>> => {
  const queryString = toQueryString(payload);
  const data = await api.get(
    `/api/Checklist/GetChecklistsWithAdvancedFilter?${queryString}`
  );
  return data?.data;
};

// GET BY ID
export const getChecklistByIdApi = async (
  id: string
): Promise<TSuccessResponse<TGetChecklistByIdResponse>> => {
  const data = await api.get(`/api/Checklist/GetChecklistById/${id}`);
  return data?.data;
};

// DELETE (if needed)
export const deleteChecklistApi = async (
  id: string
): Promise<TSuccessResponse<null>> => {
  const data = await api.delete(`/api/Checklist/DeleteChecklist/${id}`);
  return data?.data;
};

// EXPORT TO EXCEL (if needed)
export const exportChecklistExcelApi = async (
  payload: TExportChecklistPayload
): Promise<Blob> => {
  const queryString = toQueryString(payload);
  const data = await api.get(
    `/api/Checklist/ExportChecklistExcel?${queryString}`,
    { responseType: "blob" }
  );
  return data?.data;
};
```

2. **Type Definitions** (in `src/features/[feature]/types/api.ts`)

```typescript
import {
  TPaginationPayload,
  TTableQueryPayload,
} from "@/shared/types/api/payload";
import { TPaginationResponse } from "@/shared/types/api/response";

// CREATE Payload
export interface ICreateChecklistPayload {
  name: string;
  description: string;
  isActive: boolean;
  projectId: string;
  // ... other fields from API docs
}

// UPDATE Payload (includes ID)
export interface IUpdateChecklistPayload extends ICreateChecklistPayload {
  checklistId: string;
}

// Response for single item
export interface TGetChecklistByIdResponse {
  checklistId: string;
  name: string;
  description: string;
  isActive: boolean;
  projectId: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string | null;
  modifiedBy: string | null;
  // ... other fields from API response
}

// Response for create (usually includes timestamps)
export type TCreateChecklistResponse = TGetChecklistByIdResponse & {
  createdBy: string;
  createdDate: string;
};

// List item type
export type TChecklist = {
  checklistId: string;
  name: string;
  description: string;
  isActive: boolean;
  projectId: string;
  // ... other fields
};

// GET ALL Payload (pagination + filters)
export type TGetAllChecklistsPayload = TPaginationPayload &
  Partial<TTableQueryPayload> & {
    projectId?: string | null;
    // ... other optional filters
  };

// GET ALL Response (paginated)
export type TGetAllChecklistsResponse = TPaginationResponse & {
  data: TChecklist[];
};

// EXPORT Payload (filters without pagination)
export type TExportChecklistPayload = Partial<TTableQueryPayload> & {
  projectId?: string | null;
};
```

### Naming Conventions

- **API Functions**: `[action][Feature]Api` (e.g., `createChecklistApi`, `getAllTagsApi`)
- **Types**:
  - Interfaces start with `I` for payloads (e.g., `ICreateChecklistPayload`)
  - Types start with `T` for responses and complex types (e.g., `TGetAllChecklistResponse`)
- **Feature Folders**: Use lowercase with hyphens (e.g., `document-checklist`, `auth`)
- **File Names**: Use lowercase with hyphens (e.g., `checklist.ts`, `api.ts`)

### Common Patterns

- Use `api` instance from `@/shared/services/axios`
- Wrap responses in `TSuccessResponse<T>` type
- Query strings: Use `toQueryString()` helper from `@/shared/utils/helpers`
- Blob responses: Set `responseType: "blob"` for Excel exports
- Null safety: Use `?` for optional response fields and `| null` for nullable fields
- Date types: Use `string` for API dates (ISO format), convert to `Date` in components if needed

### API Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  message: string;
  data: T; // Your actual data
  errors?: string[];
}
```

### When I Provide API Documentation

1. Extract endpoint URL and HTTP method
2. Create type definitions in `types/api.ts` first
3. Create API function in `api/[feature].ts`
4. Match field names exactly as shown in API documentation (case-sensitive)
5. Add proper TypeScript types for all parameters and return values
6. Handle optional fields with `?` or `| null` as appropriate

### Example Workflow

When you give me:

```
POST /api/Checklist/CreateChecklist
Body: { name: "string", description: "string", projectId: "string", isActive: true }
```

I will:

1. Create `ICreateChecklistPayload` type
2. Create `TCreateChecklistResponse` type
3. Create `createChecklistApi` function with proper typing
4. Follow the exact naming from your API docs

## React Query Hooks Guidelines

### Query Hook Structure (in `src/features/[feature]/hooks/query/[feature].ts`)

```typescript
import {
  getAllChecklistsApi,
  getChecklistByIdApi,
  exportChecklistExcelApi,
} from "@/features/document-checklist/api/checklist";
import {
  GET_ALL_CHECKLISTS,
  GET_CHECKLIST_BY_ID,
} from "@/features/document-checklist/constants/query";
import { TTableQueryPayload } from "@/shared/types/api/payload";
import { handleQueryBlobError } from "@/shared/utils/errors/errorHandler";
import {
  downloadBlobFile,
  formatFilterSortPayload,
} from "@/shared/utils/helpers";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

// GET ALL Hook (with pagination and filters)
type TUseGetAllChecklists = Partial<TTableQueryPayload> & {
  pageSize: number;
  pageNumber: number;
  enabled?: boolean;
  projectId?: string | null;
  // ... other optional filters
};

export type TUseGetAllChecklistsReturnType = {
  data: TChecklist[];
  meta: {
    totalRowCount: number;
    page: number;
    pageSize: number;
  };
};

export const useGetAllChecklists = (
  payload: TUseGetAllChecklists
): UseQueryResult<TUseGetAllChecklistsReturnType> => {
  const formattedPayload = formatFilterSortPayload({
    filters: payload.filters,
    sortOptions: payload.sortOptions,
    filtersLogicalOperator: payload.filtersLogicalOperator,
  });

  return useQuery({
    queryKey: [
      GET_ALL_CHECKLISTS,
      payload.pageSize,
      payload.pageNumber,
      formattedPayload,
      payload.projectId,
    ],
    queryFn: async () => {
      const data = await getAllChecklistsApi({
        ...formattedPayload,
        pageNumber: payload.pageNumber,
        pageSize: payload.pageSize,
        projectId: payload.projectId,
      });

      return {
        data: data?.data?.data ?? [],
        meta: {
          totalRowCount: data?.data?.totalRecords ?? 0,
          page: data.data.pageNumber ?? 1,
          pageSize: payload.pageSize,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 min caching
    refetchOnWindowFocus: false,
    enabled: payload.enabled ?? true,
  });
};

// GET BY ID Hook
export const useGetChecklistById = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: [GET_CHECKLIST_BY_ID, id],
    queryFn: async () => {
      const data = await getChecklistByIdApi(id);
      if (data.status === -1) {
        return data.data;
      }
      return null;
    },
    enabled,
    staleTime: 0,
  });
};
```

### Mutation Hook Structure (in `src/features/[feature]/hooks/mutation/[feature].ts`)

```typescript
import {
  createChecklistApi,
  updateChecklistApi,
  deleteChecklistApi,
} from "@/features/document-checklist/api/checklist";
import {
  GET_ALL_CHECKLISTS,
  GET_CHECKLIST_BY_ID,
} from "@/features/document-checklist/constants/query";
import {
  ICreateChecklistPayload,
  IUpdateChecklistPayload,
} from "@/features/document-checklist/types/api";
import { getMutationErrorMsg } from "@/shared/utils/errors/errorHandler";
import { handleSuccessApiToast } from "@/shared/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// CREATE Mutation
export const useCreateChecklist = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateChecklistPayload) =>
      createChecklistApi(payload),
    onSuccess: (data) => {
      const isSuccess = handleSuccessApiToast(data);
      if (isSuccess) {
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

### Query Constants (in `src/features/[feature]/constants/query.ts`)

```typescript
export const GET_ALL_CHECKLISTS = "GET_ALL_CHECKLISTS";
export const GET_CHECKLIST_BY_ID = "GET_CHECKLIST_BY_ID";
export const CHECK_CHECKLIST_EXIST = "CHECK_CHECKLIST_EXIST";
export const GET_ALL_CHECKLISTS_DROPDOWNS = "GET_ALL_CHECKLISTS_DROPDOWNS";
export const EXPORT_CHECKLIST_EXCEL = "EXPORT_CHECKLIST_EXCEL";
```

### React Query Hook Patterns

- Use `formatFilterSortPayload` for filters and sorting before sending to API
- Include all query parameters in `queryKey` for proper caching
- Check `data.status === -1` to determine API success
- Set appropriate `staleTime`:
  - `0` for frequently changing data (e.g., get by ID)
  - `5 * 60 * 1000` (5 minutes) for list data
  - `10 * 60 * 1000` (10 minutes) for dropdowns/static data
- Use `enabled` parameter to control when queries run
- Invalidate related queries after mutations
- Use `handleSuccessApiToast` for success messages
- Use `getMutationErrorMsg` for error handling
- Export explicit return types for queries (e.g., `TUseGetAllChecklistsReturnType`)
- Set `refetchOnWindowFocus: false` for stable list data

### Query Hook Naming

- **Query Hooks**: `useGet[Feature]`, `useGetAll[Feature]`, `useGet[Feature]ById`
- **Mutation Hooks**: `useCreate[Feature]`, `useUpdate[Feature]`, `useDelete[Feature]`
- **Export Hooks**: `useExport[Feature]Excel`
- **Check Hooks**: `useCheck[Feature]Exist`

### Common Query Hook Parameters

```typescript
// For list queries
type TUseGetAllChecklists = Partial<TTableQueryPayload> & {
  pageSize: number;
  pageNumber: number;
  enabled?: boolean;
  projectId?: string | null;
};

// For single item queries
enabled: boolean; // Control when query runs
id: string; // Resource identifier

// For export queries
downloadDirectly?: boolean; // Auto-download on success
```

## Additional Guidelines

### State Management with Zustand

```typescript
// Store structure (in src/shared/store/[store].ts)
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistStore {
  selectedChecklists: string[];
  filters: Record<string, any>;
  setSelectedChecklists: (ids: string[]) => void;
  setFilters: (filters: Record<string, any>) => void;
  clearSelection: () => void;
}

export const useChecklistStore = create<ChecklistStore>()(
  devtools(
    persist(
      (set) => ({
        selectedChecklists: [],
        filters: {},
        setSelectedChecklists: (ids) => set({ selectedChecklists: ids }),
        setFilters: (filters) => set({ filters }),
        clearSelection: () => set({ selectedChecklists: [] }),
      }),
      { name: "checklist-store" }
    ),
    { name: "checklist-store" }
  )
);
```

### Form Handling

```typescript
// Use react-hook-form with validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checklistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type ChecklistFormData = z.infer<typeof checklistSchema>;

export function ChecklistForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
  });

  const onSubmit = (data: ChecklistFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Theme Management

```typescript
// Using next-themes for dark/light mode
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      variant="ghost"
      size="icon"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### Error Boundaries

```typescript
// Custom error boundary component
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

### Testing Patterns

```typescript
// Component testing with MSW for API mocking
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '@/mocks/server';
import { ChecklistList } from './ChecklistList';

describe('ChecklistList', () => {
  it('renders checklist items', async () => {
    server.use(
      rest.get('/api/checklist', (req, res, ctx) => {
        return res(ctx.json({
          success: true,
          data: [
            { id: '1', name: 'Safety Checklist', isActive: true }
          ]
        }));
      })
    );

    render(<ChecklistList />);

    await waitFor(() => {
      expect(screen.getByText('Safety Checklist')).toBeInTheDocument();
    });
  });
});
```

### Accessibility Guidelines

- Always include `aria-label` or `aria-labelledby` for interactive elements
- Use semantic HTML elements (`<button>`, `<input>`, `<select>`)
- Ensure keyboard navigation works
- Provide sufficient color contrast
- Include focus indicators
- Use `role` attributes when semantic elements aren't appropriate

### Performance Optimization

- Use `React.memo` for components that re-render frequently
- Implement proper dependency arrays in `useEffect`
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to child components
- Lazy load route components with `React.lazy`
- Optimize images and use appropriate formats
- Use virtualization for large lists (`react-window` or `react-virtualized`)

## Environment Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_AZURE_CLIENT_ID`: Azure AD client ID
- `VITE_AZURE_TENANT_ID`: Azure AD tenant ID
- `VITE_ENVIRONMENT`: development/staging/production
- `VITE_APP_VERSION`: Application version for cache busting

### Environment-Specific Settings

```typescript
// Environment configuration (in src/shared/config/configService.ts)
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
  },
  azure: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
    redirectUri: window.location.origin,
  },
  app: {
    environment: import.meta.env.VITE_ENVIRONMENT,
    version: import.meta.env.VITE_APP_VERSION,
  },
};
```

### Development vs Production

- **Development**: Use local API endpoints, enable debug logging
- **Staging**: Use staging API endpoints, enable error reporting
- **Production**: Use production API endpoints, disable debug logging

## Component Creation Guidelines

### When I ask for "Create a component":

1. **Define Component Interface** - Create TypeScript interface for props
2. **Implement Component Structure** - Follow the established component pattern
3. **Add Error Handling** - Include proper error boundaries and loading states
4. **Implement Responsive Design** - Use Tailwind responsive classes
5. **Add Accessibility** - Include ARIA labels and semantic HTML
6. **Create Unit Tests** - Write comprehensive test cases
7. **Follow Naming Conventions** - Use PascalCase for component names

### Component Types and Patterns

#### Form Components

```tsx
// Form component pattern
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof formSchema>;

export function UserForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input {...register("name")} id="name" />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

#### Data Display Components

```tsx
// Data table component pattern
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
}

export function DataTable<T>({ data, columns, loading }: DataTableProps<T>) {
  if (loading) return <SkeletonCard />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render
                  ? column.render(item)
                  : (item as any)[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

#### Modal/Dialog Components

```tsx
// Modal component pattern
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  trigger,
  title,
  children,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

### Component Composition Patterns

#### Container/Presentational Pattern

```tsx
// Container component (handles data logic)
export function ChecklistContainer() {
  const { data, isLoading, error } = useGetAllChecklists({
    pageSize: 10,
    pageNumber: 1,
  });

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorFallback error={error} />;

  return <ChecklistList checklists={data} />;
}

// Presentational component (handles UI)
interface ChecklistListProps {
  checklists: TChecklist[];
}

export function ChecklistList({ checklists }: ChecklistListProps) {
  return (
    <div className="space-y-4">
      {checklists.map((checklist) => (
        <ChecklistCard key={checklist.checklistId} checklist={checklist} />
      ))}
    </div>
  );
}
```

#### Compound Component Pattern

```tsx
// Compound component pattern for complex UI
interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

export function Tab({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={activeTab === value ? "active" : ""}
    >
      {children}
    </button>
  );
}

export function TabPanel({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;
  return <div className="tab-panel">{children}</div>;
}

// Usage
<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="details">Details</Tab>
  </TabList>
  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="details">Details content</TabPanel>
</Tabs>;
```

## Integration Patterns

### Third-Party Library Integrations

#### MSAL (Azure AD Authentication)

```typescript
// MSAL configuration (in src/shared/config/msalConfig.ts)
import { Configuration, PublicClientApplication } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const initializeMsalInstance = () => {
  return new PublicClientApplication(msalConfig);
};

// Usage in components
import { useMsal } from '@azure/msal-react';

export function LoginButton() {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup({
        scopes: ['User.Read'],
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <Button onClick={handleLogin}>Sign In</Button>;
}
```

#### TanStack Query (Data Fetching)

```typescript
// Query client setup (in src/main.tsx)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

#### Zustand (State Management)

```typescript
// Store pattern (in src/shared/store/[store].ts)
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppStore {
  user: User | null;
  theme: "light" | "dark";
  setUser: (user: User | null) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        theme: "light",
        setUser: (user) => set({ user }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "app-store",
        partialize: (state) => ({ theme: state.theme }), // Only persist theme
      }
    ),
    { name: "app-store" }
  )
);
```

#### React Hook Form with Zod

```typescript
// Form validation setup
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormData) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('age', { valueAsNumber: true })} type="number" placeholder="Age" />
      {errors.age && <span>{errors.age.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Axios with Interceptors

```typescript
// Axios instance setup (in src/shared/services/axios.ts)
import axios from "axios";
import { config } from "@/shared/config/configService";

export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Integration Best Practices

#### Error Handling Across Libraries

```typescript
// Centralized error handling
import { toast } from "sonner";

export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || "An error occurred";
    toast.error(message);
  } else if (error.request) {
    // Network error
    toast.error("Network error. Please check your connection.");
  } else {
    // Something else happened
    toast.error("An unexpected error occurred.");
  }
};

// Usage in components
const { data, error } = useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  onError: handleApiError,
});
```

#### Loading States Management

```typescript
// Loading state coordination
export function useLoadingState(queries: UseQueryResult[]) {
  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const error = queries.find(query => query.error)?.error;

  return { isLoading, isError, error };
}

// Usage
const checklistQuery = useGetAllChecklists({ pageSize: 10 });
const userQuery = useGetCurrentUser();

const { isLoading, isError, error } = useLoadingState([checklistQuery, userQuery]);

if (isLoading) return <SkeletonCard />;
if (isError) return <ErrorFallback error={error} />;
```

Remember to always test your changes thoroughly and follow the established patterns in the codebase. When in doubt, look at existing components for reference implementations.

## Styling Decision Priority (Order Matters)

1. Follow this decision matrix first.
2. Prefer TSX (Tailwind) for simple, one-off styles.
3. Use CSS for reusable, semantic, or complex styles.
4. Never duplicate the same style in both CSS and TSX.
5. If unsure, default to clarity and reusability.

## Enforced Styling Rules for Copilot

- Theme colors and design tokens MUST be defined in CSS.
- One-off colors and opacity variants MUST be written in TSX using Tailwind.
- Font families, letter spacing, and line heights MUST live in CSS.
- Font sizes and weights MAY be used in TSX if not reused.
- Complex layouts (custom grid templates, advanced flex logic) MUST be written in CSS.
- Simple layout utilities (flex, grid, alignment) MUST use Tailwind.
- Pseudo-elements (::before, ::after, ::placeholder) MUST NEVER be written in TSX.
- Keyframe animations MUST be defined in CSS.
- Simple transitions SHOULD use Tailwind utilities.

## Copilot Summary

If a style is reusable, semantic, or complex → use CSS.  
If a style is simple, local, or one-off → use Tailwind in TSX.
