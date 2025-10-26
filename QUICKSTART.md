# Quick Reference - API Usage

## 📦 Installation

Dependencies are already installed:
- ✅ axios
- ✅ @tanstack/react-query

## 🔧 Configuration

### 1. Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 2. Provider Setup
Already added to `app/layout.tsx`:
```typescript
import { QueryProvider } from '@/lib/providers/query-provider';

<QueryProvider>
  {children}
</QueryProvider>
```

## 🚀 Quick Start Examples

### Authentication

```typescript
import { useLogin, useCurrentUser, useLogout } from '@/lib/hooks/use-auth';

function LoginForm() {
  const login = useLogin();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  // Login
  await login.mutateAsync({ email, password });

  // Get current user
  console.log(user);

  // Logout
  await logout.mutateAsync();
}
```

### Lessons

```typescript
import { 
  useLessons, 
  useLesson, 
  useCreateLesson, 
  useUpdateLesson, 
  useDeleteLesson 
} from '@/lib/hooks/use-lessons';

function LessonsPage() {
  // List lessons with pagination
  const { data, isLoading } = useLessons({ page: 1, pageSize: 10 });

  // Get single lesson
  const { data: lesson } = useLesson('lesson-id');

  // Create lesson
  const createLesson = useCreateLesson();
  await createLesson.mutateAsync({
    title: 'Algebra Basics',
    description: 'Introduction to algebra',
    content: 'Lesson content...',
    grade: 8,
    subject: 'Math',
  });

  // Update lesson
  const updateLesson = useUpdateLesson();
  await updateLesson.mutateAsync({
    id: 'lesson-id',
    data: { title: 'Updated Title' },
  });

  // Delete lesson
  const deleteLesson = useDeleteLesson();
  await deleteLesson.mutateAsync('lesson-id');
}
```

### Questions

```typescript
import { 
  useQuestions, 
  useQuestionsByLesson,
  useCreateQuestion 
} from '@/lib/hooks/use-questions';
import { QuestionType, DifficultyLevel } from '@/lib/api/types';

function QuestionsPage() {
  // List all questions
  const { data } = useQuestions({ page: 1, pageSize: 20 });

  // Get questions by lesson
  const { data: lessonQuestions } = useQuestionsByLesson('lesson-id');

  // Create question
  const createQuestion = useCreateQuestion();
  await createQuestion.mutateAsync({
    lessonId: 'lesson-id',
    question: 'What is 2 + 2?',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.EASY,
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    explanation: 'Basic addition',
    points: 10,
  });
}
```

### Users

```typescript
import { useUsers, useCreateUser, useUpdateUser } from '@/lib/hooks/use-users';
import { UserRole } from '@/lib/api/types';

function UsersPage() {
  // List users
  const { data } = useUsers({ page: 1, search: 'john' });

  // Create user
  const createUser = useCreateUser();
  await createUser.mutateAsync({
    email: 'user@example.com',
    name: 'John Doe',
    role: UserRole.STUDENT,
  });

  // Update user
  const updateUser = useUpdateUser();
  await updateUser.mutateAsync({
    id: 'user-id',
    data: { name: 'Jane Doe' },
  });
}
```

### Practice Sessions

```typescript
import { 
  useStartPractice, 
  useSubmitPractice,
  usePracticeHistory 
} from '@/lib/hooks/use-practice';
import { DifficultyLevel } from '@/lib/api/types';

function PracticePage() {
  const startPractice = useStartPractice();
  const submitPractice = useSubmitPractice();
  const { data: history } = usePracticeHistory();

  // Start practice session
  const session = await startPractice.mutateAsync({
    lessonId: 'lesson-id',
    questionCount: 10,
    difficulty: DifficultyLevel.MEDIUM,
  });

  // Submit answers
  const result = await submitPractice.mutateAsync({
    sessionId: session.id,
    answers: [
      { questionId: 'q1', answer: '4' },
      { questionId: 'q2', answer: 'true' },
    ],
  });

  console.log(`Score: ${result.score}/${result.totalPoints}`);
}
```

## 🎯 Common Patterns

### Loading States
```typescript
const { data, isLoading, error } = useLessons();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <LessonsList data={data} />;
```

### Mutation States
```typescript
const createLesson = useCreateLesson();

<button 
  onClick={() => createLesson.mutate(data)}
  disabled={createLesson.isPending}
>
  {createLesson.isPending ? 'Creating...' : 'Create'}
</button>

{createLesson.isSuccess && <Success />}
{createLesson.error && <Error message={createLesson.error.message} />}
```

### Pagination
```typescript
const [page, setPage] = useState(1);
const { data } = useLessons({ page, pageSize: 10 });

<Pagination 
  current={data.pagination.page}
  total={data.pagination.totalPages}
  onChange={setPage}
/>
```

### Search & Filters
```typescript
const [search, setSearch] = useState('');
const [grade, setGrade] = useState<number>();

const { data } = useLessons({ 
  page: 1, 
  search,
  grade,
});
```

## 📝 Type Definitions

### Enums
```typescript
// User Roles
UserRole.ADMIN
UserRole.TEACHER
UserRole.STUDENT

// Question Types
QuestionType.MULTIPLE_CHOICE
QuestionType.TRUE_FALSE
QuestionType.SHORT_ANSWER
QuestionType.ESSAY

// Difficulty Levels
DifficultyLevel.EASY
DifficultyLevel.MEDIUM
DifficultyLevel.HARD
```

### Common Interfaces
```typescript
// User
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Lesson
interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  grade: number;
  subject: string;
}

// Question
interface Question {
  id: string;
  lessonId: string;
  question: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

// Paginated Response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}
```

## 🔍 Direct API Calls (Without Hooks)

For server components or special cases:

```typescript
import { AuthService, LessonService } from '@/lib/api';

// In a server component or API route
async function getData() {
  const lessons = await LessonService.getLessons({ page: 1 });
  return lessons;
}
```

## 🛠️ Adding Custom Endpoints

### 1. Add to config (`lib/api/config.ts`)
```typescript
export const API_ENDPOINTS = {
  CUSTOM: {
    LIST: '/custom',
    DETAIL: (id: string) => `/custom/${id}`,
  },
};
```

### 2. Create service (`lib/api/services/custom.service.ts`)
```typescript
import { ApiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class CustomService {
  static async getList() {
    return ApiClient.get(API_ENDPOINTS.CUSTOM.LIST);
  }
}
```

### 3. Create hook (`lib/hooks/use-custom.ts`)
```typescript
import { useQuery } from '@tanstack/react-query';
import { CustomService } from '../api/services/custom.service';

export function useCustomList() {
  return useQuery({
    queryKey: ['custom', 'list'],
    queryFn: () => CustomService.getList(),
  });
}
```

## 🐛 Debugging

### Enable API logging
API calls are automatically logged in development mode. Check the browser console for:
- 🚀 Request logs
- ✅ Response logs
- ❌ Error logs

### Check network tab
Open browser DevTools → Network tab to see actual HTTP requests

### Token issues
```typescript
import { TokenStorage } from '@/lib/api/client';

// Check token
console.log(TokenStorage.getToken());

// Clear tokens
TokenStorage.clearTokens();
```

## 📚 Full Documentation
See `lib/api/README.md` for complete documentation with more examples.
