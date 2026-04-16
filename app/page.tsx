"use client"

import { useCallback, useState } from "react"

import { NotesInput } from "@/components/notes-input"
import { ProcessingScreen } from "@/components/processing-screen"
import { Quiz } from "@/components/quiz"
import { ResultsScreen } from "@/components/results-screen"
import { type Question, type QuizAnswers } from "@/lib/quiz-schema"

type Screen = "input" | "processing" | "quiz" | "results"

export default function Home() {
  const [screen, setScreen] = useState<Screen>("input")
  const [notes, setNotes] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQuiz = useCallback(async () => {
    setIsGenerating(true)
    setGenerationError(null)
    setAnswers({})
    setScreen("processing")

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      })

      const data = (await response.json()) as {
        error?: string
        questions?: Question[]
      }

      if (!response.ok || !data.questions) {
        throw new Error(data.error ?? "Could not generate a quiz from these notes.")
      }

      setQuestions(data.questions)
      setScreen("quiz")
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Could not generate a quiz from these notes."
      )
    } finally {
      setIsGenerating(false)
    }
  }, [notes])

  const handleGenerate = useCallback(() => {
    void generateQuiz()
  }, [generateQuiz])

  const handleQuizComplete = useCallback((quizAnswers: QuizAnswers) => {
    setAnswers(quizAnswers)
    setScreen("results")
  }, [])

  const handleTryAgain = useCallback(() => {
    setAnswers({})
    setScreen("quiz")
  }, [])

  const handleNewNotes = useCallback(() => {
    setNotes("")
    setQuestions([])
    setAnswers({})
    setGenerationError(null)
    setScreen("input")
  }, [])

  const handleRetryGeneration = useCallback(() => {
    void generateQuiz()
  }, [generateQuiz])

  const handleBackToNotes = useCallback(() => {
    setScreen("input")
  }, [])

  return (
    <main className="min-h-screen">
      {screen === "input" && (
        <NotesInput
          notes={notes}
          setNotes={setNotes}
          error={generationError}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      )}

      {screen === "processing" && (
        <ProcessingScreen
          error={generationError}
          onRetry={generationError ? handleRetryGeneration : undefined}
          onBack={generationError ? handleBackToNotes : undefined}
        />
      )}

      {screen === "quiz" && questions.length > 0 && (
        <Quiz questions={questions} onComplete={handleQuizComplete} />
      )}

      {screen === "results" && questions.length > 0 && (
        <ResultsScreen
          questions={questions}
          answers={answers}
          onTryAgain={handleTryAgain}
          onNewNotes={handleNewNotes}
        />
      )}
    </main>
  )
}
