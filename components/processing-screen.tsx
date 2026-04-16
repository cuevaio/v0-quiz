"use client"

import { useEffect, useState } from "react"

import { ProgressBar } from "@/components/progress-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProcessingScreenProps {
  error?: string | null
  onRetry?: () => void
  onBack?: () => void
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

export function ProcessingScreen({ error, onRetry, onBack }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (error) {
          return prev
        }

        if (prev >= 92) {
          return 92
        }

        return prev + 0.5
      })
    }, 30)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (error) {
          return prev
        }

        if (prev >= processingSteps.length - 1) {
          return prev
        }

        return prev + 1
      })
    }, 2000)

    let logIndex = 0
    const logInterval = setInterval(() => {
      if (error) {
        return
      }

      if (logIndex < activityLogs.length) {
        setLogs((prev) => [...prev.slice(-4), activityLogs[logIndex]])
        logIndex += 1
      }
    }, 700)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearInterval(logInterval)
    }
  }, [error])

  const renderStepText = (step: (typeof processingSteps)[number]) => {
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
        <div className="text-center space-y-6">
          <div className="relative h-20 flex items-center justify-center overflow-hidden">
            {processingSteps.map((step, index) => (
              <h2
                key={step.text}
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

          <div className="flex items-center justify-center gap-2">
            {processingSteps.map((step, index) => (
              <div
                key={step.text}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index <= currentStep ? "bg-foreground" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <ProgressBar progress={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{error ? "Stopped" : "Processing"}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 font-mono text-sm">
          <div className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">
            System Activity
          </div>
          <div className="space-y-1 h-24 overflow-hidden">
            {logs.map((log) => (
              <div
                key={log}
                className={cn(
                  "text-muted-foreground transition-all duration-300",
                  log === logs[logs.length - 1] ? "text-foreground" : ""
                )}
              >
                <span className="text-muted-foreground/50 mr-2">{">"}</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="space-y-4 text-center animate-in fade-in duration-300">
            <p className="text-sm text-destructive">{error}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {onRetry && (
                <Button onClick={onRetry} className="rounded-xl">
                  Try Again
                </Button>
              )}
              {onBack && (
                <Button variant="outline" onClick={onBack} className="rounded-xl">
                  Back to Notes
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
