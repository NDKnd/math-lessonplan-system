# API Integration - Tóm tắt Hoàn chỉnh

## ✅ Đã tạo xong

Hệ thống API hoàn chỉnh đã được tạo với các thành phần sau:

### 📁 Cấu trúc thư mục

```
lib/
├── api/
│   ├── client.ts                 # Axios client với interceptors
│   ├── config.ts                 # Cấu hình API và endpoints
│   ├── types.ts                  # TypeScript types
│   ├── index.ts                  # Main export
│   ├── README.md                 # Tài liệu chi tiết
│   └── services/
│       ├── auth.service.ts       # Authentication
│       ├── user.service.ts       # User management
│       ├── lesson.service.ts     # Lesson management
│       ├── question.service.ts   # Question bank
│       ├── practice.service.ts   # Practice sessions
│       └── index.ts
├── hooks/
│   ├── use-auth.ts              # Auth hooks
│   ├── use-users.ts             # User hooks
│   ├── use-lessons.ts           # Lesson hooks
│   ├── use-questions.ts         # Question hooks
│   └── use-practice.ts          # Practice hooks
├── providers/
│   └── query-provider.tsx       # React Query provider
└── utils/
    └── error-utils.ts           # Error handling utilities

components/
└── examples/
    └── api-examples.tsx         # Ví dụ sử dụng

.env.local                       # Environment variables
QUICKSTART.md                    # Hướng dẫn nhanh
```

### 🔧 Packages đã cài đặt

- ✅ `axios` - HTTP client
- ✅ `@tanstack/react-query` - Data fetching & caching

### 🎯 Tính năng chính

#### 1. **API Client với Interceptors**
- ✅ Tự động thêm Authorization token
- ✅ Tự động refresh token khi hết hạn
- ✅ Error handling thống nhất
- ✅ Request/Response logging (development mode)
- ✅ Timeout configuration

#### 2. **Token Management**
- ✅ Tự động lưu token vào localStorage
- ✅ Tự động attach token vào requests
- ✅ Token refresh tự động
- ✅ Clear tokens khi logout

#### 3. **API Services**
Các service class đầy đủ cho:
- ✅ **Authentication**: login, register, logout, forgot password, reset password
- ✅ **Users**: CRUD operations với pagination
- ✅ **Lessons**: CRUD operations với pagination
- ✅ **Questions**: CRUD operations, get by lesson
- ✅ **Practice**: Start session, submit answers, get results, history

#### 4. **React Query Hooks**
Custom hooks cho mọi API operation:
- ✅ Automatic caching
- ✅ Loading states
- ✅ Error handling
- ✅ Optimistic updates
- ✅ Automatic refetching
- ✅ Pagination support

#### 5. **TypeScript Support**
- ✅ Full type safety
- ✅ Enums (UserRole, QuestionType, DifficultyLevel)
- ✅ Interfaces cho tất cả data types
- ✅ Query parameters types

#### 6. **Error Handling**
- ✅ Unified error format
- ✅ Validation errors support
- ✅ Status code helpers
- ✅ User-friendly error messages

## 🚀 Cách sử dụng

### 1. Cấu hình Backend URL

Chỉnh sửa `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 2. Provider đã được thêm

File `app/layout.tsx` đã có `QueryProvider`:
```tsx
import { QueryProvider } from '@/lib/providers/query-provider';

<QueryProvider>
  {children}
</QueryProvider>
```

### 3. Sử dụng trong Components

#### Ví dụ: Login
```tsx
import { useLogin } from '@/lib/hooks/use-auth';

function LoginForm() {
  const login = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login.mutateAsync({
        email: 'user@example.com',
        password: 'password123',
      });
      // Success - token được lưu tự động
    } catch (error) {
      // Handle error
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={login.isPending}>
        {login.isPending ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

#### Ví dụ: Get Lessons với Pagination
```tsx
import { useLessons } from '@/lib/hooks/use-lessons';

function LessonsList() {
  const { data, isLoading, error } = useLessons({ 
    page: 1, 
    pageSize: 10 
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.data.map((lesson) => (
        <div key={lesson.id}>
          <h3>{lesson.title}</h3>
          <p>{lesson.description}</p>
        </div>
      ))}
      <div>
        Page {data.pagination.page} of {data.pagination.totalPages}
      </div>
    </div>
  );
}
```

#### Ví dụ: Create Lesson
```tsx
import { useCreateLesson } from '@/lib/hooks/use-lessons';

function CreateLessonForm() {
  const createLesson = useCreateLesson();

  const handleSubmit = async (formData) => {
    try {
      const lesson = await createLesson.mutateAsync({
        title: 'Algebra Basics',
        description: 'Introduction to algebra',
        content: 'Lesson content...',
        grade: 8,
        subject: 'Math',
      });
      alert('Created!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createLesson.isPending}>
        {createLesson.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### Ví dụ: Question Bank
```tsx
import { useQuestionsByLesson } from '@/lib/hooks/use-questions';

function QuestionsList({ lessonId }) {
  const { data, isLoading } = useQuestionsByLesson(lessonId);

  if (isLoading) return <div>Loading questions...</div>;

  return (
    <div>
      {data.data.map((question) => (
        <div key={question.id}>
          <p>{question.question}</p>
          <span>Difficulty: {question.difficulty}</span>
          <span>Points: {question.points}</span>
        </div>
      ))}
    </div>
  );
}
```

#### Ví dụ: Practice Session
```tsx
import { useStartPractice, useSubmitPractice } from '@/lib/hooks/use-practice';
import { DifficultyLevel } from '@/lib/api/types';

function PracticeSession({ lessonId }) {
  const startPractice = useStartPractice();
  const submitPractice = useSubmitPractice();

  const handleStart = async () => {
    const session = await startPractice.mutateAsync({
      lessonId,
      questionCount: 10,
      difficulty: DifficultyLevel.MEDIUM,
    });
    // Session started, display questions
  };

  const handleSubmit = async (sessionId, answers) => {
    const result = await submitPractice.mutateAsync({
      sessionId,
      answers,
    });
    alert(`Score: ${result.score}/${result.totalPoints}`);
  };

  return (
    <div>
      <button onClick={handleStart}>Start Practice</button>
    </div>
  );
}
```

## 📚 Tài liệu

1. **QUICKSTART.md** - Hướng dẫn nhanh với examples
2. **lib/api/README.md** - Tài liệu chi tiết đầy đủ
3. **components/examples/api-examples.tsx** - Component ví dụ có thể chạy

## 🔍 API Endpoints đã config

```typescript
// Authentication
/auth/login
/auth/register
/auth/logout
/auth/refresh
/auth/me

// Users
/users
/users/:id

// Lessons
/lessons
/lessons/:id

// Questions
/questions
/questions/:id
/questions/lesson/:lessonId

// Practice
/practice/start
/practice/submit
/practice/results/:sessionId
/practice/history
```

## 🎨 TypeScript Types có sẵn

```typescript
// Enums
UserRole.ADMIN | TEACHER | STUDENT
QuestionType.MULTIPLE_CHOICE | TRUE_FALSE | SHORT_ANSWER | ESSAY
DifficultyLevel.EASY | MEDIUM | HARD

// Interfaces
User, Lesson, Question
PracticeSession, PracticeResult
LoginRequest, RegisterRequest
CreateLessonRequest, UpdateLessonRequest
CreateQuestionRequest, UpdateQuestionRequest
StartPracticeRequest, SubmitPracticeRequest
PaginatedResponse<T>
ApiError, ApiResponse<T>
QueryParams (page, pageSize, search, sortBy, sortOrder)
```

## ⚙️ Features nâng cao

### Auto Token Refresh
```typescript
// Tự động refresh token khi 401 Unauthorized
// Retry request với token mới
// Redirect to login nếu refresh failed
```

### Error Handling Utils
```typescript
import { 
  formatApiError, 
  isUnauthorized, 
  isValidationError 
} from '@/lib/utils/error-utils';

try {
  await api.call();
} catch (error) {
  console.log(formatApiError(error));
  
  if (isUnauthorized(error)) {
    // Handle unauthorized
  }
  
  if (isValidationError(error)) {
    // Handle validation errors
  }
}
```

### Query Key Management
```typescript
// Tất cả hooks có query keys được quản lý tốt
// Automatic invalidation sau mutations
// Optimistic updates support
```

## 🔐 Token Flow

1. User login → Token được lưu vào localStorage
2. Mọi request tự động có Authorization header
3. Token expired (401) → Tự động refresh
4. Refresh success → Retry original request
5. Refresh failed → Clear tokens & redirect to login

## 🌟 Best Practices

1. ✅ Sử dụng hooks trong React components
2. ✅ Sử dụng services trực tiếp trong server components
3. ✅ Luôn handle loading và error states
4. ✅ Sử dụng TypeScript types cho type safety
5. ✅ Dùng environment variables cho config
6. ✅ Check documentation cho advanced features

## 🐛 Debugging

- API calls được log tự động trong development mode
- Check browser console cho request/response logs
- Check Network tab trong DevTools
- Token issues: `TokenStorage.getToken()` để kiểm tra

## 🎯 Next Steps

1. Thay đổi `NEXT_PUBLIC_API_BASE_URL` trong `.env.local` theo backend của bạn
2. Test API với component examples: `components/examples/api-examples.tsx`
3. Tùy chỉnh types trong `lib/api/types.ts` theo backend schema
4. Thêm custom endpoints nếu cần (xem QUICKSTART.md)

## 💡 Tips

- Xem file `QUICKSTART.md` cho các examples nhanh
- Xem `lib/api/README.md` cho documentation đầy đủ
- Xem `components/examples/api-examples.tsx` cho working examples
- Tất cả types đều có JSDoc comments
- Intellisense sẽ gợi ý tất cả available methods và types

---

**Hệ thống API đã sẵn sàng sử dụng! 🚀**
