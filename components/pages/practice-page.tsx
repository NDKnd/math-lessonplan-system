"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "essay" | "fill-in-blank";
  options?: string[];
  correctAnswer?: string;
}

export default function PracticePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: "1",
      question: "What is the solution to x² + 5x + 6 = 0?",
      type: "multiple-choice",
      options: [
        "x = -2 or x = -3",
        "x = 2 or x = 3",
        "x = -1 or x = -6",
        "x = 1 or x = 6",
      ],
      correctAnswer: "x = -2 or x = -3",
    },
    {
      id: "2",
      question: "Solve for x: 2x + 3 = 11",
      type: "fill-in-blank",
      correctAnswer: "4",
    },
    {
      id: "3",
      question: "What is the discriminant of x² + 4x + 4 = 0?",
      type: "multiple-choice",
      options: ["0", "4", "8", "16"],
      correctAnswer: "0",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;

  if (showResults) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Practice Complete!
          </h1>
          <p className="text-muted-foreground mt-1">Here's how you performed</p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-primary">
                {correctCount}/{questions.length}
              </div>
              <p className="text-lg text-muted-foreground">Questions Correct</p>
              <div className="text-3xl font-bold text-foreground">
                {Math.round((correctCount / questions.length) * 100)}%
              </div>
              <Progress
                value={(correctCount / questions.length) * 100}
                className="mt-4"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const isCorrect = answers[q.id] === q.correctAnswer;
            return (
              <Card
                key={q.id}
                className={`bg-card border-border ${
                  isCorrect ? "border-green-500" : "border-red-500"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {q.question}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your answer: {answers[q.id]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Practice Quiz</h1>
        <p className="text-muted-foreground mt-1">Test your knowledge</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "multiple-choice" && (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
              >
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                    >
                      <RadioGroupItem value={option} id={`option-${idx}`} />
                      <Label
                        htmlFor={`option-${idx}`}
                        className="flex-1 cursor-pointer text-foreground"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === "fill-in-blank" && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground"
              />
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
