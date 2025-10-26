"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import Dashboard from "@/components/pages/dashboard"
import LessonPlanEditor from "@/components/pages/lesson-plan-editor"
import QuestionBank from "@/components/pages/question-bank"
import PracticePage from "@/components/pages/practice-page"
import UserManagement from "@/components/pages/user-management"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [userRole, setUserRole] = useState<"teacher" | "student">("teacher")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      <main className="flex-1 overflow-auto">
        {currentPage === "dashboard" && <Dashboard userRole={userRole} />}
        {currentPage === "lesson-plan" && <LessonPlanEditor />}
        {currentPage === "question-bank" && <QuestionBank userRole={userRole} />}
        {currentPage === "practice" && <PracticePage />}
        {currentPage === "users" && <UserManagement />}
      </main>
    </div>
  )
}
