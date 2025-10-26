"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Edit2, Trash2 } from "lucide-react"

interface Question {
  id: string
  title: string
  type: "multiple-choice" | "essay" | "fill-in-blank"
  category: string
  difficulty: "easy" | "medium" | "hard"
  createdAt: string
}

export default function QuestionBank({ userRole }: { userRole: "teacher" | "student" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      title: "What is the solution to x² + 5x + 6 = 0?",
      type: "multiple-choice",
      category: "Quadratic Equations",
      difficulty: "medium",
      createdAt: "2024-10-20",
    },
    {
      id: "2",
      title: "Solve for x: 2x + 3 = 11",
      type: "fill-in-blank",
      category: "Linear Equations",
      difficulty: "easy",
      createdAt: "2024-10-19",
    },
    {
      id: "3",
      title: "Explain the quadratic formula and its derivation",
      type: "essay",
      category: "Quadratic Equations",
      difficulty: "hard",
      createdAt: "2024-10-18",
    },
  ])

  const categories = ["all", "Quadratic Equations", "Linear Equations", "Polynomials", "Trigonometry"]

  const filteredQuestions = questions.filter(
    (q) =>
      (selectedCategory === "all" || q.category === selectedCategory) &&
      (q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return "bg-blue-100 text-blue-800"
      case "essay":
        return "bg-purple-100 text-purple-800"
      case "fill-in-blank":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "hard":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Question Bank</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your math questions</p>
        </div>
        {userRole === "teacher" && (
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-primary text-primary-foreground" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{question.title}</h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(question.type)}`}>
                      {question.type.replace("-", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">{question.category}</span>
                    <span className={`text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{question.createdAt}</span>
                  </div>
                </div>
                {userRole === "teacher" && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
