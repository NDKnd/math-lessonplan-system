# API Documentation

## Overview

This project uses a structured API layer with the following components:
- **Axios** for HTTP requests
- **React Query** for data fetching and caching
- **TypeScript** for type safety

## Directory Structure

```
lib/
├── api/
│   ├── client.ts           # Axios client with interceptors
│   ├── config.ts           # API configuration and endpoints
│   ├── types.ts            # TypeScript types and interfaces
│   ├── services/           # API service classes
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── lesson.service.ts
│   │   ├── question.service.ts
│   │   ├── practice.service.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/                  # React Query hooks
│   ├── use-auth.ts
│   ├── use-users.ts
│   ├── use-lessons.ts
│   ├── use-questions.ts
│   └── use-practice.ts
└── providers/
    └── query-provider.tsx  # React Query provider
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Usage Examples

### 1. Basic API Call with Services

```typescript
import { AuthService, UserService } from '@/lib/api';

// Login
try {
  const response = await AuthService.login({
    email: 'user@example.com',
    password: 'password123',
  });
  console.log('User:', response.user);
  console.log('Token:', response.token);
} catch (error) {
  console.error('Login failed:', error);
}

// Get users with pagination
const users = await UserService.getUsers({
  page: 1,
  pageSize: 10,
  search: 'john',
});
```

### 2. Using React Query Hooks (Recommended)

```typescript
'use client';

import { useLogin, useCurrentUser } from '@/lib/hooks/use-auth';
import { useLessons } from '@/lib/hooks/use-lessons';

function LoginForm() {
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await login.mutateAsync({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      // Login successful, token is automatically stored
      alert('Login successful!');
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}

function Dashboard() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: lessons, isLoading: lessonsLoading } = useLessons({ page: 1, pageSize: 10 });

  if (isLoading) return <div>Loading user...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
      {lessonsLoading ? (
        <div>Loading lessons...</div>
      ) : (
        <ul>
          {lessons?.data.map((lesson) => (
            <li key={lesson.id}>{lesson.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 3. Creating Data

```typescript
'use client';

import { useCreateLesson } from '@/lib/hooks/use-lessons';

function CreateLessonForm() {
  const createLesson = useCreateLesson();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const lesson = await createLesson.mutateAsync({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        content: formData.get('content') as string,
        grade: parseInt(formData.get('grade') as string),
        subject: formData.get('subject') as string,
      });
      
      alert('Lesson created successfully!');
      console.log('Created lesson:', lesson);
    } catch (error) {
      alert('Failed to create lesson!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required />
      <textarea name="content" placeholder="Content" required />
      <input name="grade" type="number" placeholder="Grade" required />
      <input name="subject" placeholder="Subject" required />
      <button type="submit" disabled={createLesson.isPending}>
        {createLesson.isPending ? 'Creating...' : 'Create Lesson'}
      </button>
    </form>
  );
}
```

### 4. Updating Data

```typescript
'use client';

import { useUpdateLesson, useLesson } from '@/lib/hooks/use-lessons';

function EditLessonForm({ lessonId }: { lessonId: string }) {
  const { data: lesson, isLoading } = useLesson(lessonId);
  const updateLesson = useUpdateLesson();

  if (isLoading) return <div>Loading...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateLesson.mutateAsync({
        id: lessonId,
        data: {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
        },
      });
      
      alert('Lesson updated successfully!');
    } catch (error) {
      alert('Failed to update lesson!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" defaultValue={lesson.title} required />
      <textarea name="description" defaultValue={lesson.description} required />
      <button type="submit" disabled={updateLesson.isPending}>
        {updateLesson.isPending ? 'Updating...' : 'Update Lesson'}
      </button>
    </form>
  );
}
```

### 5. Deleting Data

```typescript
'use client';

import { useDeleteLesson } from '@/lib/hooks/use-lessons';

function DeleteLessonButton({ lessonId }: { lessonId: string }) {
  const deleteLesson = useDeleteLesson();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await deleteLesson.mutateAsync(lessonId);
      alert('Lesson deleted successfully!');
    } catch (error) {
      alert('Failed to delete lesson!');
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteLesson.isPending}>
      {deleteLesson.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### 6. Practice Session Example

```typescript
'use client';

import { useStartPractice, useSubmitPractice } from '@/lib/hooks/use-practice';
import { DifficultyLevel } from '@/lib/api/types';

function PracticeSession() {
  const startPractice = useStartPractice();
  const submitPractice = useSubmitPractice();

  const handleStart = async () => {
    try {
      const session = await startPractice.mutateAsync({
        lessonId: 'lesson-id',
        questionCount: 10,
        difficulty: DifficultyLevel.MEDIUM,
      });
      
      console.log('Practice session started:', session);
      // Display questions from session.questions
    } catch (error) {
      alert('Failed to start practice!');
    }
  };

  const handleSubmit = async (sessionId: string, answers: any[]) => {
    try {
      const result = await submitPractice.mutateAsync({
        sessionId,
        answers,
      });
      
      console.log('Practice results:', result);
      alert(`Your score: ${result.score}/${result.totalPoints}`);
    } catch (error) {
      alert('Failed to submit answers!');
    }
  };

  return (
    <div>
      <button onClick={handleStart} disabled={startPractice.isPending}>
        Start Practice
      </button>
    </div>
  );
}
```

## Features

### Automatic Token Management
- Tokens are automatically stored in localStorage
- Tokens are automatically attached to requests
- Automatic token refresh on 401 errors
- Automatic redirect to login on authentication failure

### Request/Response Interceptors
- Automatic authorization header injection
- Error handling and transformation
- Request/response logging in development mode
- Automatic retry logic for failed requests

### Type Safety
- Full TypeScript support
- Typed API responses
- Typed request parameters
- Enum types for consistent values

### React Query Benefits
- Automatic caching
- Background refetching
- Optimistic updates
- Loading and error states
- Pagination support

## Error Handling

All API errors are transformed into a consistent format:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

Example error handling:

```typescript
try {
  await AuthService.login(credentials);
} catch (error) {
  const apiError = error as ApiError;
  console.error('Error:', apiError.message);
  console.error('Status:', apiError.statusCode);
  
  if (apiError.errors) {
    // Display validation errors
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      console.error(`${field}:`, messages.join(', '));
    });
  }
}
```

## Best Practices

1. **Use React Query hooks in components** - They provide automatic caching, loading states, and error handling
2. **Use service classes directly in server components** - For Next.js server components, use the service classes directly
3. **Configure environment variables** - Always use environment variables for API configuration
4. **Handle errors gracefully** - Always wrap API calls in try-catch blocks
5. **Use TypeScript types** - Import and use the provided types for type safety

## Customization

### Adding New Endpoints

1. Add endpoint to `lib/api/config.ts`:
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORT: (id: string) => `/analytics/reports/${id}`,
  },
};
```

2. Create service in `lib/api/services/`:
```typescript
// analytics.service.ts
import { ApiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class AnalyticsService {
  static async getDashboard() {
    return ApiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  }
}
```

3. Create React Query hook in `lib/hooks/`:
```typescript
// use-analytics.ts
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../api';

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => AnalyticsService.getDashboard(),
  });
}
```

## Troubleshooting

### CORS Errors
Make sure your backend API has proper CORS configuration to allow requests from your frontend domain.

### Token Issues
If tokens are not being saved or attached, check that localStorage is available (client-side only).

### Type Errors
Make sure to install all dependencies:
```bash
npm install axios @tanstack/react-query --legacy-peer-deps
```
