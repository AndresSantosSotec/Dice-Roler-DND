"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DiceShape } from "@/components/dice-shapes"
import { DICE_TYPES } from "@/components/quick-dice-roller"

export interface RollResult {
  id: string
  sides: number
  count: number
  rolls: number[]
  modifier: number
  modifierMode: "each" | "total"
  rollMode: "normal" | "advantage" | "disadvantage"
  total: number
  timestamp: number
  advantageRolls?: number[][]
  chosenIndex?: number
}

interface ResultDisplayProps {
  result: RollResult | null
  isRolling: boolean
}

function getResultType(result: RollResult) {
  if (result.sides === 20 && result.count === 1) {
    const raw = result.rollMode !== "normal" && result.advantageRolls
      ? result.advantageRolls[result.chosenIndex ?? 0][0]
      : result.rolls[0]
    if (raw === 20) return "critical"
    if (raw === 1) return "fail"
  }
  return "normal"
}

function FloatingNumber({ value, delay }: { value: number; delay: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  if (!visible) return null

  return (
    <span
      className="inline-flex items-center justify-center rounded-md bg-secondary px-2 py-1 font-mono text-sm font-bold text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {value}
    </span>
  )
}

export function ResultDisplay({ result, isRolling }: ResultDisplayProps) {
  const dieType = result ? DICE_TYPES.find((d) => d.sides === result.sides) : null
  const dieColor = dieType?.color ?? "hsl(142 60% 50%)"
  const resultType = result ? getResultType(result) : "normal"

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Dice animation area */}
        <div className="relative">
          <DiceShape
            sides={result?.sides ?? 20}
            className="h-28 w-28"
            isRolling={isRolling}
            value={isRolling ? undefined : result?.total}
            color={dieColor}
          />
          {!isRolling && result && resultType === "critical" && (
            <div className="absolute -inset-2 animate-pulse rounded-full border-2 border-accent opacity-50" />
          )}
          {!isRolling && result && resultType === "fail" && (
            <div className="absolute -inset-2 animate-pulse rounded-full border-2 border-destructive opacity-50" />
          )}
        </div>

        {/* Result text */}
        {!isRolling && result && (
          <div className="flex flex-col items-center gap-2">
            {/* Status badge */}
            {resultType === "critical" && (
              <span className="rounded-md bg-accent/20 px-3 py-1 font-mono text-sm font-bold uppercase tracking-wider text-accent animate-in zoom-in duration-300">
                CRITICAL HIT
              </span>
            )}
            {resultType === "fail" && (
              <span className="rounded-md bg-destructive/20 px-3 py-1 font-mono text-sm font-bold uppercase tracking-wider text-destructive animate-in zoom-in duration-300">
                PIFIA
              </span>
            )}

            {/* Total */}
            <p
              className={`font-mono text-5xl font-black tabular-nums ${
                resultType === "critical"
                  ? "text-accent"
                  : resultType === "fail"
                    ? "text-destructive"
                    : "text-foreground"
              }`}
            >
              {result.total}
            </p>

            {/* Formula */}
            <p className="font-mono text-xs text-muted-foreground">
              {result.count}d{result.sides}
              {result.modifier !== 0 && (
                <span>{result.modifier > 0 ? `+${result.modifier}` : result.modifier}</span>
              )}
              {result.rollMode !== "normal" && (
                <span className={result.rollMode === "advantage" ? " text-accent" : " text-destructive"}>
                  {" "}({result.rollMode === "advantage" ? "ventaja" : "desventaja"})
                </span>
              )}
            </p>

            {/* Advantage/Disadvantage detail */}
            {result.rollMode !== "normal" && result.advantageRolls && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-muted-foreground">Tiradas:</p>
                <div className="flex gap-2">
                  {result.advantageRolls.map((rolls, i) => (
                    <span
                      key={i}
                      className={`rounded px-2 py-0.5 font-mono text-sm font-bold ${
                        i === result.chosenIndex
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground line-through"
                      }`}
                    >
                      {rolls.reduce((a, b) => a + b, 0)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Individual rolls */}
            {result.rolls.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {result.rolls.map((roll, i) => (
                  <FloatingNumber key={`${result.id}-${i}`} value={roll} delay={i * 50} />
                ))}
                {result.modifier !== 0 && result.modifierMode === "total" && (
                  <span className="font-mono text-sm font-bold text-primary">
                    {result.modifier > 0 ? `+${result.modifier}` : result.modifier}
                  </span>
                )}
              </div>
            )}

            {/* Single roll with modifier */}
            {result.rolls.length === 1 && result.modifier !== 0 && (
              <p className="font-mono text-xs text-muted-foreground">
                {result.rolls[0]} {result.modifier > 0 ? "+" : ""}{result.modifier} = {result.total}
              </p>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isRolling && !result && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm text-muted-foreground">Selecciona una tirada para comenzar</p>
          </div>
        )}

        {/* Rolling state */}
        {isRolling && (
          <p className="animate-pulse font-mono text-sm font-bold text-primary">
            Tirando dados...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
