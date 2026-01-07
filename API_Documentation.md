# Document API Layer Documentation

## Overview
This document describes the API layer structure, naming conventions, usage instructions, and guidelines for adding new endpoints in the NB-PEM codebase.

## API Layer Structure

### Directory Structure
```
src/
├── api/                    # Core API functions (mock/real)
│   └── auth.ts            # Authentication API functions
├── shared/
│   └── services/          # Shared service utilities
│       ├── axios.ts       # Axios instance configuration
│       ├── errorLogger.ts # API error logging
│       └── monitoring.ts  # API monitoring utilities
└── features/
    └── */services/        # Feature-specific services
        └── auth.service.ts # Authentication service
```

### Key Components

1. **Core API Layer (`src/api/`)**:
   - Contains low-level API functions
   - Handles direct HTTP communication
   - Returns raw responses

2. **Shared Services (`src/shared/services/`)**:
   - `axios.ts`: Configured axios instance with interceptors
   - `errorLogger.ts`: Centralized error logging
   - `monitoring.ts`: API monitoring and metrics

3. **Feature Services (`src/features/*/services/`)**:
   - Business logic services
   - Data transformation
   - Error handling
   - Mock data for development

## Naming Conventions

### Files
- Service files: `{feature}.service.ts`
- API files: `{domain}.ts`
- Utilities: `{purpose}.ts`

### Functions
- Service functions: `{action}Service` (e.g., `loginService`, `fetchMeService`)
- API functions: camelCase (e.g., `getUser`, `login`)
- Private functions: camelCase with underscore prefix (e.g., `_transformData`)

### Variables
- API instances: `api`
- Response data: `data`
- Error objects: `error`
- Configuration: `{purpose}Config`

## Usage Instructions

### Using Feature Services

```typescript
import { loginService } from '@/features/auth/services/auth.service'

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await loginService(email, password)
    const { token, user } = response.data
    // Handle success
  } catch (error) {
    // Handle error
  }
}
```

### Using Core API Functions

```typescript
import { getUser } from '@/api/auth'

const fetchUser = async () => {
  try {
    const [status, data] = await getUser()
    if (status === 200) {
      // Handle success
    }
  } catch (error) {
    // Handle error
  }
}
```

### Axios Instance Usage

```typescript
import { api } from '@/shared/services/axios'

// GET request
const response = await api.get('/users')

// POST request
const response = await api.post('/users', userData)
```

## Adding New Endpoints

### Step 1: Define API Function
Create or update API functions in `src/api/{domain}.ts`:

```typescript
// src/api/users.ts
export async function getUsers() {
  // Implementation
  return [200, mockUsers] as const
}

export async function createUser(userData: UserData) {
  // Implementation
  return [201, createdUser] as const
}
```

### Step 2: Create Service Function
Add business logic in `src/features/{feature}/services/{feature}.service.ts`:

```typescript
// src/features/users/services/users.service.ts
import { api } from '@/shared/services/axios'

export const getUsersService = async () => {
  try {
    const response = await api.get('/users')
    return {
      data: response.data,
      success: true
    }
  } catch (error) {
    logApiError(error)
    throw new Error('Failed to fetch users')
  }
}

export const createUserService = async (userData: UserData) => {
  try {
    const response = await api.post('/users', userData)
    return {
      data: response.data,
      success: true
    }
  } catch (error) {
    logApiError(error)
    throw new Error('Failed to create user')
  }
}
```

### Step 3: Update Types
Add necessary types in `src/types/{domain}.ts`:

```typescript
// src/types/user.ts
export interface User {
  id: number
  email: string
  name: string
  role: string
}

export interface UserData {
  email: string
  name: string
  role: string
}
```

### Step 4: Handle Errors
Use the error logger for consistent error handling:

```typescript
import { logApiError } from '@/shared/services/errorLogger'

try {
  // API call
} catch (error) {
  logApiError(error)
  // Handle error
}
```

### Step 5: Add Monitoring (Optional)
For critical endpoints, add monitoring:

```typescript
import { initMonitoring } from '@/shared/services/monitoring'

// In main.tsx or app initialization
initMonitoring()
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Consistent Naming**: Follow established naming conventions
4. **Separation of Concerns**: Keep API logic separate from business logic
5. **Mock Data**: Provide mock implementations for development
6. **Documentation**: Document all public functions and parameters

## Environment Configuration

API base URL is configured via environment variables:

```env
VITE_API_BASE_URL=https://api.example.com
```

## Testing

Create test files for services:

```typescript
// src/features/auth/services/__tests__/auth.service.test.ts
import { loginService } from '../auth.service'

describe('loginService', () => {
  it('should login successfully', async () => {
    // Test implementation
  })
})
```

---

*Generated on December 18, 2025*
*NB-PEM Codebase API Documentation*</content>
<parameter name="filePath">c:\Users\398617\NB_PEM\NB_PEM\API_Documentation.md