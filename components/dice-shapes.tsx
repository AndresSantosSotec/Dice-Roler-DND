"use client"

import { cn } from "@/lib/utils"

interface DiceShapeProps {
  sides: number
  className?: string
  isRolling?: boolean
  value?: number
  color?: string
}

export function DiceShape({ sides, className, isRolling, value, color = "hsl(142 60% 50%)" }: DiceShapeProps) {
  const shapes: Record<number, JSX.Element> = {
    4: (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <polygon points="50,10 90,85 10,85" fill="hsl(228 10% 16%)" stroke={color} strokeWidth="2.5" />
        <line x1="50" y1="10" x2="50" y2="60" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="90" y1="85" x2="50" y2="60" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="10" y1="85" x2="50" y2="60" stroke="hsl(228 10% 22%)" strokeWidth="1" />
      </svg>
    ),
    6: (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <rect x="15" y="15" width="70" height="70" rx="8" fill="hsl(228 10% 16%)" stroke={color} strokeWidth="2.5" />
        <line x1="50" y1="15" x2="50" y2="85" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
        <line x1="15" y1="50" x2="85" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
      </svg>
    ),
    8: (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <polygon points="50,5 95,50 50,95 5,50" fill="hsl(228 10% 16%)" stroke={color} strokeWidth="2.5" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="1" />
      </svg>
    ),
    10: (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <polygon points="50,5 90,35 75,90 25,90 10,35" fill="hsl(228 10% 16%)" stroke={color} strokeWidth="2.5" />
        <line x1="50" y1="5" x2="50" y2="55" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="90" y1="35" x2="50" y2="55" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="10" y1="35" x2="50" y2="55" stroke="hsl(228 10% 22%)" strokeWidth="1" />
      </svg>
    ),
    12: (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <polygon points="50,5 85,25 95,60 75,90 25,90 5,60 15,25" fill="hsl(228 10% 16%)" stroke={color} strokeWidth="2.5" />
        <line x1="50" y1="5" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
        <line x1="85" y1="25" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
        <line x1="95" y1="60" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
        <line x1="15" y1="25" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
        <line x1="5" y1="60" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="0.8" />
      </svg>
    ),
    20: (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
        <polygon points="50,5 95,35 80,90 20,90 5,35" fill="hsl(228 10% 16%)" stroke={color} strokeWidth="2.5" />
        <line x1="50" y1="5" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="95" y1="35" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="80" y1="90" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="20" y1="90" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="1" />
        <line x1="5" y1="35" x2="50" y2="50" stroke="hsl(228 10% 22%)" strokeWidth="1" />
      </svg>
    ),
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        isRolling && "animate-dice-roll",
        className
      )}
    >
      {shapes[sides] || shapes[20]}
      {value !== undefined && (
        <span
          className={cn(
            "absolute font-mono font-bold",
            sides <= 6 ? "text-sm" : sides <= 10 ? "text-base" : "text-lg",
            value === sides && sides === 20 ? "text-accent" : "text-foreground"
          )}
        >
          {value}
        </span>
      )}
    </div>
  )
}
