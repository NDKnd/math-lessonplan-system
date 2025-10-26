import Dashboard from "@/components/pages/dashboard";

export default function DashboardPage() {
  // TODO: Get user role from authentication context
  const userRole = "teacher" as "teacher" | "student";

  return <Dashboard userRole={userRole} />;
}
