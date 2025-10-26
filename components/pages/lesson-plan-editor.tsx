"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Download, X } from "lucide-react"

interface Section {
  id: string
  title: string
  content: string
  exercises: string[]
}

export default function LessonPlanEditor() {
  const [lessonTitle, setLessonTitle] = useState("Quadratic Equations")
  const [lessonDescription, setLessonDescription] = useState("Understanding and solving quadratic equations")
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      title: "Introduction",
      content: "Quadratic equations are polynomial equations of degree 2...",
      exercises: ["Exercise 1.1", "Exercise 1.2"],
    },
    {
      id: "2",
      title: "Methods of Solution",
      content: "There are several methods to solve quadratic equations...",
      exercises: ["Exercise 2.1", "Exercise 2.2", "Exercise 2.3"],
    },
  ])

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "New Section",
      content: "",
      exercises: [],
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
  }

  const exportToWord = () => {
    alert("Export to Word functionality would be implemented here")
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lesson Plan Editor</h1>
          <p className="text-muted-foreground mt-1">Create and manage your lesson plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToWord} className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export to Word
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Save Lesson
          </Button>
        </div>
      </div>

      {/* Lesson Metadata */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Lesson Title</label>
            <Input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="mt-1 bg-input border-border text-foreground"
              placeholder="Enter lesson title"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              className="mt-1 bg-input border-border text-foreground"
              placeholder="Enter lesson description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Sections</h2>
          <Button onClick={addSection} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>

        {sections.map((section) => (
          <Card key={section.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, "title", e.target.value)}
                  className="text-lg font-semibold bg-transparent border-0 text-foreground p-0"
                  placeholder="Section title"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(section.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Content</label>
                <Textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, "content", e.target.value)}
                  className="mt-1 bg-input border-border text-foreground"
                  placeholder="Enter section content"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Exercises</label>
                <div className="mt-2 space-y-2">
                  {section.exercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border">
                      <span className="text-sm text-foreground">{exercise}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
