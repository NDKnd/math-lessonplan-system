"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Users, BarChart3, LogOut, Menu } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: "teacher" | "student";
  setUserRole: (role: "teacher" | "student") => void;
}

export default function Sidebar({
  currentPage,
  setCurrentPage,
  userRole,
  setUserRole,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    ...(userRole === "teacher"
      ? [
          { id: "lesson-plan", label: "Lesson Plans", icon: BookOpen },
          { id: "question-bank", label: "Question Bank", icon: Users },
          { id: "users", label: "User Management", icon: Users },
        ]
      : [{ id: "practice", label: "Practice", icon: BookOpen }]),
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {isOpen && (
          <h1 className="text-xl font-bold text-sidebar-primary">MathLearn</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                currentPage === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className={`text-sm ${isOpen ? "block" : "hidden"}`}>
          <p className="text-sidebar-foreground font-medium mb-2">Role</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={userRole === "teacher" ? "default" : "outline"}
              onClick={() => setUserRole("teacher")}
              className="flex-1"
            >
              Teacher
            </Button>
            <Button
              size="sm"
              variant={userRole === "student" ? "default" : "outline"}
              onClick={() => setUserRole("student")}
              className="flex-1"
            >
              Student
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
