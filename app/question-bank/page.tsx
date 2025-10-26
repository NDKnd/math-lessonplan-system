import QuestionBank from "@/components/pages/question-bank";

export default function QuestionBankPage() {
  // TODO: Get user role from authentication context
  const userRole = "teacher" as "teacher" | "student";

  return <QuestionBank userRole={userRole} />;
}
