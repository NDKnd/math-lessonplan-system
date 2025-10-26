"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Users, BarChart3, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  userRole: "teacher" | "student";
  setUserRole: (role: "teacher" | "student") => void;
}

export default function SidebarNav({ userRole, setUserRole }: SidebarNavProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
    },
    ...(userRole === "teacher"
      ? [
          {
            id: "lesson-plan",
            label: "Lesson Plans",
            icon: BookOpen,
            href: "/lesson-plan",
          },
          {
            id: "question-bank",
            label: "Question Bank",
            icon: Users,
            href: "/question-bank",
          },
          {
            id: "users",
            label: "User Management",
            icon: Users,
            href: "/users",
          },
        ]
      : [
          {
            id: "practice",
            label: "Practice",
            icon: BookOpen,
            href: "/practice",
          },
        ]),
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
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-5 w-5" />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
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
