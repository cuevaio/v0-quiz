"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface NotesInputProps {
  notes: string
  setNotes: (notes: string) => void
  onGenerate: () => void
}

export function NotesInput({ notes, setNotes, onGenerate }: NotesInputProps) {
  const isValid = notes.trim().length > 20

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Headline */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
            Turn notes into{" "}
            <span className="bg-accent px-3 py-1 rounded-lg">quizzes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Paste your study notes and we&apos;ll generate an interactive quiz to test your knowledge.
          </p>
        </div>

        {/* Textarea */}
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes here... (at least 20 characters)"
            className="w-full h-64 p-6 text-lg bg-card border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all placeholder:text-muted-foreground/50"
          />
          
          {/* Character count hint */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{notes.length} characters</span>
            {!isValid && notes.length > 0 && (
              <span>Need at least 20 characters</span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onGenerate}
            disabled={!isValid}
            size="lg"
            className="h-14 px-8 text-lg font-semibold rounded-2xl gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Quiz
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
