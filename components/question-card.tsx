"use client"

import { type Question } from "@/lib/quiz-schema"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface QuestionCardProps {
  question: Question
  answer: string | string[]
  setAnswer: (answer: string | string[]) => void
}

export function QuestionCard({ question, answer, setAnswer }: QuestionCardProps) {
  const handleSingleSelect = (option: string) => {
    setAnswer(option)
  }

  const handleMultiSelect = (option: string) => {
    const currentAnswers = Array.isArray(answer) ? answer : []
    if (currentAnswers.includes(option)) {
      setAnswer(currentAnswers.filter((a) => a !== option))
    } else {
      setAnswer([...currentAnswers, option])
    }
  }

  const handleTextChange = (text: string) => {
    setAnswer(text)
  }

  const isOptionSelected = (option: string) => {
    if (Array.isArray(answer)) {
      return answer.includes(option)
    }
    return answer === option
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
      {/* Question text */}
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
        {question.question}
      </h3>

      {/* Question type hint */}
      <p className="text-sm text-muted-foreground">
        {question.type === "single" && "Select one answer"}
        {question.type === "multiple" && "Select all that apply"}
        {question.type === "text" && "Type your answer"}
      </p>

      {/* Options */}
      {question.type !== "text" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              type="button"
              key={`${question.id}-${option}-${index}`}
              onClick={() =>
                question.type === "single"
                  ? handleSingleSelect(option)
                  : handleMultiSelect(option)
              }
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all",
                isOptionSelected(option)
                  ? "border-foreground bg-secondary"
                  : "border-border hover:border-foreground/30 hover:bg-secondary/50"
              )}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all shrink-0",
                  question.type === "multiple" ? "rounded-md" : "",
                  isOptionSelected(option)
                    ? "border-foreground bg-foreground text-background"
                    : "border-muted-foreground/40"
                )}
              >
                {isOptionSelected(option) && <Check className="w-4 h-4" />}
              </div>
              
              {/* Option text */}
              <span className="text-lg font-medium">{option}</span>
            </button>
          ))}
        </div>
      )}

      {/* Text input */}
      {question.type === "text" && (
        <textarea
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-32 p-5 text-lg bg-input border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
        />
      )}
    </div>
  )
}
