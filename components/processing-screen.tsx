"use client"

import { useEffect, useState } from "react"
import { ProgressBar } from "@/components/progress-bar"
import { cn } from "@/lib/utils"

interface ProcessingScreenProps {
  onComplete: () => void
}

const processingSteps = [
  { text: "Reading your notes", highlight: "notes" },
  { text: "Understanding concepts", highlight: "concepts" },
  { text: "Generating questions", highlight: "questions" },
  { text: "Refining answers", highlight: "answers" },
]

const activityLogs = [
  "Tokenizing input...",
  "Extracting key terms...",
  "Building knowledge graph...",
  "Mapping relationships...",
  "Selecting question types...",
  "Formulating prompts...",
  "Validating responses...",
  "Finalizing quiz...",
]

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 0.5
      })
    }, 30)

    // Step transitions
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    // Activity logs
    let logIndex = 0
    const logInterval = setInterval(() => {
      if (logIndex < activityLogs.length) {
        setLogs((prev) => [...prev.slice(-4), activityLogs[logIndex]])
        logIndex++
      }
    }, 700)

    // Completion
    const completeTimeout = setTimeout(() => {
      setIsComplete(true)
      setTimeout(onComplete, 500)
    }, 6000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearInterval(logInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  const renderStepText = (step: typeof processingSteps[0]) => {
    const parts = step.text.split(step.highlight)
    return (
      <>
        {parts[0]}
        <span className="bg-accent px-2 py-0.5 rounded-md">{step.highlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl space-y-12">
        {/* Main status text */}
        <div className="text-center space-y-6">
          <div className="relative h-20 flex items-center justify-center overflow-hidden">
            {processingSteps.map((step, index) => (
              <h2
                key={index}
                className={cn(
                  "absolute text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500",
                  currentStep === index
                    ? "opacity-100 translate-y-0"
                    : currentStep > index
                    ? "opacity-0 -translate-y-8"
                    : "opacity-0 translate-y-8"
                )}
              >
                {renderStepText(step)}
                <span className="animate-pulse">...</span>
              </h2>
            ))}
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2">
            {processingSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index <= currentStep ? "bg-foreground" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <ProgressBar progress={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Processing</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Activity logs */}
        <div className="bg-card border border-border rounded-xl p-4 font-mono text-sm">
          <div className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">
            System Activity
          </div>
          <div className="space-y-1 h-24 overflow-hidden">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "text-muted-foreground transition-all duration-300",
                  index === logs.length - 1 ? "text-foreground" : ""
                )}
              >
                <span className="text-muted-foreground/50 mr-2">{">"}</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Completion indicator */}
        {isComplete && (
          <div className="text-center animate-in fade-in duration-300">
            <span className="text-lg font-medium text-foreground">
              Quiz ready!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
