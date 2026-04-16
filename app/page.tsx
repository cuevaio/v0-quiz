"use client"

import { useState, useCallback } from "react"
import { NotesInput } from "@/components/notes-input"
import { ProcessingScreen } from "@/components/processing-screen"
import { Quiz } from "@/components/quiz"
import { ResultsScreen } from "@/components/results-screen"
import { type Question } from "@/components/question-card"

type Screen = "input" | "processing" | "quiz" | "results"

// Hardcoded quiz questions (mixed types)
const quizQuestions: Question[] = [
  {
    id: 1,
    type: "single",
    question: "What is the primary function of mitochondria in a cell?",
    options: [
      "Store genetic information",
      "Produce energy (ATP)",
      "Synthesize proteins",
      "Break down waste products",
    ],
    correctAnswer: "Produce energy (ATP)",
  },
  {
    id: 2,
    type: "multiple",
    question: "Which of the following are considered renewable energy sources?",
    options: ["Solar power", "Natural gas", "Wind energy", "Coal", "Hydroelectric"],
    correctAnswer: ["Solar power", "Wind energy", "Hydroelectric"],
  },
  {
    id: 3,
    type: "single",
    question: "In computer science, what does 'API' stand for?",
    options: [
      "Advanced Programming Interface",
      "Application Programming Interface",
      "Automated Process Integration",
      "Application Process Integration",
    ],
    correctAnswer: "Application Programming Interface",
  },
  {
    id: 4,
    type: "text",
    question: "What is the chemical symbol for gold?",
    correctAnswer: "Au",
  },
  {
    id: 5,
    type: "single",
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
]

export default function Home() {
  const [screen, setScreen] = useState<Screen>("input")
  const [notes, setNotes] = useState("")
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})

  const handleGenerate = useCallback(() => {
    setScreen("processing")
  }, [])

  const handleProcessingComplete = useCallback(() => {
    setScreen("quiz")
  }, [])

  const handleQuizComplete = useCallback((quizAnswers: Record<number, string | string[]>) => {
    setAnswers(quizAnswers)
    setScreen("results")
  }, [])

  const handleTryAgain = useCallback(() => {
    setAnswers({})
    setScreen("quiz")
  }, [])

  const handleNewNotes = useCallback(() => {
    setNotes("")
    setAnswers({})
    setScreen("input")
  }, [])

  return (
    <main className="min-h-screen">
      {screen === "input" && (
        <NotesInput
          notes={notes}
          setNotes={setNotes}
          onGenerate={handleGenerate}
        />
      )}

      {screen === "processing" && (
        <ProcessingScreen onComplete={handleProcessingComplete} />
      )}

      {screen === "quiz" && (
        <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
      )}

      {screen === "results" && (
        <ResultsScreen
          questions={quizQuestions}
          answers={answers}
          onTryAgain={handleTryAgain}
          onNewNotes={handleNewNotes}
        />
      )}
    </main>
  )
}
