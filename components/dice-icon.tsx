"use client"

import { cn } from "@/lib/utils"

interface DiceIconProps {
  value?: number
  isRolling?: boolean
  className?: string
}

export function DiceIcon({ value, isRolling, className }: DiceIconProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        isRolling && "animate-dice-roll",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* D20 icosahedron shape */}
        <polygon
          points="50,5 95,35 80,90 20,90 5,35"
          fill="hsl(228 10% 16%)"
          stroke="hsl(142 60% 50%)"
          strokeWidth="2"
        />
        <line x1="50" y1="5" x2="50" y2="50" stroke="hsl(228 10% 18%)" strokeWidth="1" />
        <line x1="95" y1="35" x2="50" y2="50" stroke="hsl(228 10% 18%)" strokeWidth="1" />
        <line x1="80" y1="90" x2="50" y2="50" stroke="hsl(228 10% 18%)" strokeWidth="1" />
        <line x1="20" y1="90" x2="50" y2="50" stroke="hsl(228 10% 18%)" strokeWidth="1" />
        <line x1="5" y1="35" x2="50" y2="50" stroke="hsl(228 10% 18%)" strokeWidth="1" />
      </svg>
      {value !== undefined && (
        <span
          className={cn(
            "absolute font-mono text-lg font-bold text-primary",
            value === 20 && "text-accent"
          )}
        >
          {value}
        </span>
      )}
    </div>
  )
}
