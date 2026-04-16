"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  progress: number
  className?: string
  thin?: boolean
}

export function ProgressBar({ progress, className, thin = false }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "w-full bg-secondary rounded-full overflow-hidden",
        thin ? "h-1" : "h-2",
        className
      )}
    >
      <div
        className="h-full bg-foreground rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}
