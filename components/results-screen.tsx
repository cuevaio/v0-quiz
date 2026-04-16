"use client"

import { Button } from "@/components/ui/button"
import { type Question } from "@/components/question-card"
import { cn } from "@/lib/utils"
import { Check, X, RotateCcw, FileText } from "lucide-react"

interface ResultsScreenProps {
  questions: Question[]
  answers: Record<number, string | string[]>
  onTryAgain: () => void
  onNewNotes: () => void
}

export function ResultsScreen({
  questions,
  answers,
  onTryAgain,
  onNewNotes,
}: ResultsScreenProps) {
  const calculateScore = () => {
    let correct = 0
    questions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (question.type === "multiple") {
        const correctArr = Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : [question.correctAnswer]
        const userArr = Array.isArray(userAnswer) ? userAnswer : []
        if (
          correctArr.length === userArr.length &&
          correctArr.every((a) => userArr.includes(a))
        ) {
          correct++
        }
      } else if (question.type === "text") {
        const correctText = Array.isArray(question.correctAnswer)
          ? question.correctAnswer[0]
          : question.correctAnswer
        const userText = typeof userAnswer === "string" ? userAnswer : ""
        if (userText.toLowerCase().trim().includes(correctText.toLowerCase().trim())) {
          correct++
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct++
        }
      }
    })
    return correct
  }

  const score = calculateScore()
  const percentage = Math.round((score / questions.length) * 100)

  const isCorrect = (question: Question): boolean => {
    const userAnswer = answers[question.id]
    if (question.type === "multiple") {
      const correctArr = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer]
      const userArr = Array.isArray(userAnswer) ? userAnswer : []
      return (
        correctArr.length === userArr.length &&
        correctArr.every((a) => userArr.includes(a))
      )
    } else if (question.type === "text") {
      const correctText = Array.isArray(question.correctAnswer)
        ? question.correctAnswer[0]
        : question.correctAnswer
      const userText = typeof userAnswer === "string" ? userAnswer : ""
      return userText.toLowerCase().trim().includes(correctText.toLowerCase().trim())
    }
    return userAnswer === question.correctAnswer
  }

  const formatAnswer = (answer: string | string[] | undefined): string => {
    if (!answer) return "No answer"
    if (Array.isArray(answer)) return answer.join(", ")
    return answer
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Score header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-accent px-3 py-1 rounded-lg">{score}</span>
            <span className="text-muted-foreground"> / {questions.length}</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {percentage}% correct
          </p>
          <div
            className={cn(
              "inline-block px-4 py-2 rounded-full text-sm font-medium",
              percentage >= 80
                ? "bg-success/20 text-success"
                : percentage >= 50
                ? "bg-accent text-accent-foreground"
                : "bg-destructive/20 text-destructive"
            )}
          >
            {percentage >= 80
              ? "Excellent work!"
              : percentage >= 50
              ? "Good effort!"
              : "Keep practicing!"}
          </div>
        </div>

        {/* Question breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Question Review</h2>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const correct = isCorrect(question)
              const userAnswer = answers[question.id]
              return (
                <div
                  key={question.id}
                  className={cn(
                    "p-6 rounded-2xl border-2 space-y-4",
                    correct
                      ? "border-success/30 bg-success/5"
                      : "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        correct
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {correct ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Question {index + 1}
                      </span>
                      <p className="text-lg font-medium">{question.question}</p>
                    </div>
                  </div>

                  <div className="ml-11 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground shrink-0">
                        Your answer:
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          correct ? "text-success" : "text-destructive"
                        )}
                      >
                        {formatAnswer(userAnswer)}
                      </span>
                    </div>
                    {!correct && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-muted-foreground shrink-0">
                          Correct answer:
                        </span>
                        <span className="text-sm font-medium text-success">
                          {formatAnswer(
                            Array.isArray(question.correctAnswer)
                              ? question.correctAnswer
                              : question.correctAnswer
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={onTryAgain}
            size="lg"
            className="h-14 px-8 text-lg rounded-2xl gap-3 w-full sm:w-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Button>
          <Button
            onClick={onNewNotes}
            size="lg"
            className="h-14 px-8 text-lg font-semibold rounded-2xl gap-3 w-full sm:w-auto transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText className="w-5 h-5" />
            New Notes
          </Button>
        </div>
      </div>
    </div>
  )
}
