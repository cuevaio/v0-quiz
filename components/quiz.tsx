"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar"
import { QuestionCard } from "@/components/question-card"
import { type Question, type QuizAnswers } from "@/lib/quiz-schema"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface QuizProps {
  questions: Question[]
  onComplete: (answers: QuizAnswers) => void
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})

  if (questions.length === 0) {
    return null
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const currentAnswer = answers[currentQuestion.id] ?? (currentQuestion.type === "multiple" ? [] : "")

  const isAnswerValid = () => {
    const answer = currentAnswer
    if (currentQuestion.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0
    }
    if (currentQuestion.type === "text") {
      return typeof answer === "string" && answer.trim().length > 0
    }
    return typeof answer === "string" && answer.length > 0
  }

  const handleSetAnswer = (answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      {/* Top progress */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <ProgressBar progress={progress} thin />
        <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <QuestionCard
            question={currentQuestion}
            answer={currentAnswer}
            setAnswer={handleSetAnswer}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            size="lg"
            className="h-12 px-6 rounded-xl gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isAnswerValid()}
            size="lg"
            className="h-12 px-8 rounded-xl gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          >
            {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
