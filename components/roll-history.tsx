"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RollHistoryProps {
  rolls: number[]
}

export function RollHistory({ rolls }: RollHistoryProps) {
  const lastRolls = rolls.slice(-200)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-foreground">
          Historial de Tiradas
          {rolls.length > 200 && (
            <span className="text-xs font-normal text-muted-foreground">
              (ultimas 200 de {rolls.length.toLocaleString()})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rolls.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            Sin tiradas
          </div>
        ) : (
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap gap-1.5">
              {lastRolls.map((roll, i) => (
                <span
                  key={`${rolls.length - lastRolls.length + i}`}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded font-mono text-xs font-bold ${
                    roll === 20
                      ? "bg-accent/20 text-accent"
                      : roll === 1
                        ? "bg-destructive/20 text-destructive"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {roll}
                </span>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
