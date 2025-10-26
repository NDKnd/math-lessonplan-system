"use client";

import { useState } from "react";
import { useLogin, useCurrentUser, useLogout } from "@/lib/hooks/use-auth";
import {
  useLessons,
  useCreateLesson,
  useDeleteLesson,
} from "@/lib/hooks/use-lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Example Login Component
 */
export function LoginExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  if (user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
          <CardDescription>You are logged in as {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {login.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {(login.error as any)?.message || "Login failed"}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={login.isPending} className="w-full">
            {login.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Example Lessons List Component
 */
export function LessonsListExample() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useLessons({ page, pageSize: 10 });
  const deleteLesson = useDeleteLesson();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Loading lessons...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load lessons: {(error as any)?.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lessons</CardTitle>
        <CardDescription>
          Page {data?.pagination.page} of {data?.pagination.totalPages}(
          {data?.pagination.totalItems} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.data.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {lesson.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Grade {lesson.grade} • {lesson.subject}
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(`Delete "${lesson.title}"?`)) {
                    deleteLesson.mutate(lesson.id);
                  }
                }}
                disabled={deleteLesson.isPending}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!data || page >= data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Example Create Lesson Component
 */
export function CreateLessonExample() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [grade, setGrade] = useState("1");
  const [subject, setSubject] = useState("Math");

  const createLesson = useCreateLesson();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createLesson.mutateAsync({
        title,
        description,
        content,
        grade: parseInt(grade),
        subject,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setContent("");
      setGrade("1");
      setSubject("Math");
    } catch (error: any) {
      console.error("Create lesson error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Lesson</CardTitle>
        <CardDescription>Add a new math lesson to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {createLesson.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {(createLesson.error as any)?.message ||
                  "Failed to create lesson"}
              </AlertDescription>
            </Alert>
          )}

          {createLesson.isSuccess && (
            <Alert>
              <AlertDescription>Lesson created successfully!</AlertDescription>
            </Alert>
          )}

          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Lesson title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Lesson description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Lesson content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Grade</label>
              <Input
                type="number"
                min="1"
                max="12"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createLesson.isPending}
            className="w-full"
          >
            {createLesson.isPending ? "Creating..." : "Create Lesson"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Complete Example Page Component
 */
export function ApiExamplePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Integration Examples</h1>
        <p className="text-muted-foreground">
          Examples of using the API with React Query hooks
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <LoginExample />
        <CreateLessonExample />
      </div>

      <LessonsListExample />
    </div>
  );
}
