
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DiceShape } from "@/components/dice-shapes"

export interface DiceType {
  sides: number
  label: string
  color: string
}

export const DICE_TYPES: DiceType[] = [
  { sides: 20, label: "d20", color: "hsl(142 60% 50%)" },
  { sides: 4, label: "d4", color: "hsl(200 70% 50%)" },
  { sides: 6, label: "d6", color: "hsl(38 90% 55%)" },
  { sides: 8, label: "d8", color: "hsl(280 60% 55%)" },
  { sides: 10, label: "d10", color: "hsl(0 70% 55%)" },
  { sides: 12, label: "d12", color: "hsl(170 60% 45%)" },
]

const QUICK_COUNTS = [1, 2, 3, 4, 5, 6]

interface QuickDiceRollerProps {
  onRoll: (sides: number, count: number) => void
  isRolling: boolean
}

export function QuickDiceRoller({ onRoll, isRolling }: QuickDiceRollerProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground">
        Tirada Rápida
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DICE_TYPES.map((die) => (
          <Card key={die.sides} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex flex-col items-center gap-1">
                <DiceShape sides={die.sides} className="h-12 w-12" color={die.color} />
                <span className="font-mono text-sm font-bold" style={{ color: die.color }}>
                  {die.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_COUNTS.map((count) => (
                  <Button
                    key={count}
                    variant="secondary"
                    size="sm"
                    disabled={isRolling}
                    onClick={() => onRoll(die.sides, count)}
                    className="font-mono text-xs hover:bg-secondary/80"
                    style={{
                      borderColor: die.color + "33",
                    }}
                  >
                    {count}{die.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
