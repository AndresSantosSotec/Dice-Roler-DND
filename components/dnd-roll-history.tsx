"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { DICE_TYPES } from "@/components/quick-dice-roller"
import { Clock, Trash2 } from "lucide-react"
import type { RollResult } from "@/components/result-display"

interface DndRollHistoryProps {
  history: RollResult[]
  onClear: () => void
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
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

export function DndRollHistory({ history, onClear }: DndRollHistoryProps) {
  const reversed = [...history].reverse()
  const dieColorMap = Object.fromEntries(DICE_TYPES.map((d) => [d.sides, d.color]))

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Historial
            {history.length > 0 && (
              <span className="font-mono text-xs font-normal text-muted-foreground">
                ({history.length})
              </span>
            )}
          </CardTitle>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            Las tiradas apareceran aqui
          </div>
        ) : (
          <ScrollArea className="h-[320px]">
            <div className="flex flex-col gap-2 pr-3">
              {reversed.map((r) => {
                const type = getResultType(r)
                const color = dieColorMap[r.sides] ?? "hsl(142 60% 50%)"
                return (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                      type === "critical"
                        ? "bg-accent/10 border border-accent/20"
                        : type === "fail"
                          ? "bg-destructive/10 border border-destructive/20"
                          : "bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-md font-mono text-xs font-bold"
                        style={{ backgroundColor: color + "22", color }}
                      >
                        d{r.sides}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-muted-foreground">
                          {r.count}d{r.sides}
                          {r.modifier !== 0 && (r.modifier > 0 ? `+${r.modifier}` : r.modifier)}
                          {r.rollMode !== "normal" && (
                            <span className={r.rollMode === "advantage" ? " text-accent" : " text-destructive"}>
                              {" "}({r.rollMode === "advantage" ? "V" : "D"})
                            </span>
                          )}
                        </span>
                        {r.rolls.length > 1 && (
                          <span className="font-mono text-xs text-muted-foreground/60">
                            [{r.rolls.join(", ")}]
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xl font-black ${
                          type === "critical"
                            ? "text-accent"
                            : type === "fail"
                              ? "text-destructive"
                              : "text-foreground"
                        }`}
                      >
                        {r.total}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground/50">
                        {formatTime(r.timestamp)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
