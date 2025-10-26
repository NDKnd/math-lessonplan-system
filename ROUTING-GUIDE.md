# Next.js App Router - Hướng Dẫn Routing

## 🎯 Tổng Quan

Dự án đã được chuyển đổi từ **client-side state routing** sang **Next.js App Router** thật sự.

## 📁 Cấu Trúc Mới

```
app/
├── layout.tsx              # Root layout với Sidebar
├── page.tsx                # Homepage (redirect to /dashboard)
├── dashboard/
│   └── page.tsx           # /dashboard
├── lesson-plan/
│   └── page.tsx           # /lesson-plan
├── question-bank/
│   └── page.tsx           # /question-bank
├── practice/
│   └── page.tsx           # /practice
└── users/
    └── page.tsx           # /users
```

## 🚀 Cách Routing Hoạt Động

### 1. **File-based Routing**

Next.js sử dụng **file-based routing**. Mỗi folder trong `app/` tạo ra một route segment:

| File Path | URL | Component |
|-----------|-----|-----------|
| `app/page.tsx` | `/` | Redirect to `/dashboard` |
| `app/dashboard/page.tsx` | `/dashboard` | Dashboard |
| `app/lesson-plan/page.tsx` | `/lesson-plan` | Lesson Plan Editor |
| `app/question-bank/page.tsx` | `/question-bank` | Question Bank |
| `app/practice/page.tsx` | `/practice` | Practice Page |
| `app/users/page.tsx` | `/users` | User Management |

### 2. **Layout System**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SidebarNav />           {/* Shared sidebar */}
      <main>{children}</main>  {/* Page content */}
    </div>
  )
}
```

- **Layout được chia sẻ** giữa tất cả các pages
- Sidebar luôn hiển thị, chỉ có nội dung chính thay đổi
- **Không re-render** sidebar khi chuyển trang

### 3. **Navigation**

#### a) **Link Component**
```tsx
import Link from "next/link"

<Link href="/dashboard">
  <Button>Dashboard</Button>
</Link>
```

#### b) **usePathname Hook**
```tsx
"use client"
import { usePathname } from "next/navigation"

const pathname = usePathname() // "/dashboard"
const isActive = pathname === "/dashboard"
```

#### c) **redirect Function**
```tsx
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
```

### 4. **Active Route Detection**

```tsx
// components/layout/sidebar-nav.tsx
const pathname = usePathname()
const isActive = pathname === item.href

<Link href={item.href}>
  <Button variant={isActive ? "default" : "ghost"}>
    {item.label}
  </Button>
</Link>
```

## ✨ Ưu Điểm Của Next.js App Router

### 1. **URL Thay Đổi**
- ✅ Mỗi trang có URL riêng
- ✅ Có thể bookmark từng trang
- ✅ Browser back/forward hoạt động

### 2. **Better UX**
- ⚡ Prefetching tự động
- ⚡ Instant navigation
- ⚡ Optimistic UI updates

### 3. **SEO Friendly**
- 🔍 Mỗi route có metadata riêng
- 🔍 Server-side rendering (nếu cần)

### 4. **Code Splitting**
- 📦 Tự động split code theo route
- 📦 Chỉ load code cần thiết
- 📦 Faster initial page load

## 🔄 So Sánh: Trước vs Sau

### **TRƯỚC (State-based Routing)**
```tsx
// ❌ URL luôn là "/"
const [currentPage, setCurrentPage] = useState("dashboard")

// Navigation
<Button onClick={() => setCurrentPage("dashboard")}>
  Dashboard
</Button>

// Conditional rendering
{currentPage === "dashboard" && <Dashboard />}
{currentPage === "lesson-plan" && <LessonPlan />}
```

### **SAU (Next.js App Router)**
```tsx
// ✅ URL thay đổi theo route
// /dashboard, /lesson-plan, etc.

// Navigation
<Link href="/dashboard">
  <Button>Dashboard</Button>
</Link>

// File-based routing (tự động)
app/dashboard/page.tsx → /dashboard
app/lesson-plan/page.tsx → /lesson-plan
```

## 📝 Chi Tiết Các File

### 1. **app/layout.tsx**
```tsx
"use client"
- Shared layout cho tất cả pages
- Chứa Sidebar và main content area
- Quản lý userRole state (tạm thời)
```

### 2. **app/page.tsx**
```tsx
- Homepage redirect to /dashboard
- Sử dụng redirect() function
```

### 3. **app/[route]/page.tsx**
```tsx
- Mỗi route có page.tsx riêng
- Import component từ components/pages/
- Truyền props nếu cần (userRole, etc.)
```

### 4. **components/layout/sidebar-nav.tsx**
```tsx
"use client"
- Sử dụng Link cho navigation
- Sử dụng usePathname() để detect active route
- Không còn dùng state để điều hướng
```

## 🎨 User Experience Flow

```
1. User visits http://localhost:3000/
   ↓
2. app/page.tsx redirect to /dashboard
   ↓
3. URL changes to /dashboard
   ↓
4. app/dashboard/page.tsx renders
   ↓
5. User clicks "Lesson Plans" in sidebar
   ↓
6. Next.js navigates to /lesson-plan
   ↓
7. URL changes, content updates
   ↓
8. Browser history works correctly
```

## 🔧 Testing Navigation

Sau khi chạy `pnpm dev`, test các route này:

- `http://localhost:3000/` → Redirects to `/dashboard`
- `http://localhost:3000/dashboard` → Dashboard page
- `http://localhost:3000/lesson-plan` → Lesson Plan Editor
- `http://localhost:3000/question-bank` → Question Bank
- `http://localhost:3000/practice` → Practice Page
- `http://localhost:3000/users` → User Management

## 🚀 Next Steps

### 1. **Authentication Context**
Thay vì dùng state trong layout, tạo AuthContext:
```tsx
// lib/contexts/auth-context.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  // ...
}
```

### 2. **Protected Routes**
```tsx
// middleware.ts
export function middleware(request) {
  if (!isAuthenticated) {
    return redirect('/login')
  }
}
```

### 3. **Dynamic Routes**
```tsx
// app/lesson-plan/[id]/page.tsx
export default function LessonDetailPage({ params }) {
  const { id } = params
  // ...
}
```

### 4. **Loading & Error States**
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <Spinner />
}

// app/dashboard/error.tsx
export default function Error({ error, reset }) {
  return <ErrorPage />
}
```

## 📚 Tài Liệu Tham Khảo

- [Next.js App Router](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Linking and Navigating](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)

---

**Lưu ý:** File `components/layout/sidebar.tsx` cũ vẫn còn nhưng không được dùng nữa. Có thể xóa nếu muốn.
