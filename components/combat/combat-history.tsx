"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, Sun, Flame } from "lucide-react"
import { DAMAGE_TYPE_CONFIG } from "./combat-types"
import type { CombatRollResult } from "./combat-types"

interface CombatHistoryProps {
  history: CombatRollResult[]
  onClear: () => void
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export function CombatHistory({ history, onClear }: CombatHistoryProps) {
  const reversed = [...history].reverse()

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Historial de Combate
            {history.length > 0 && (
              <span className="font-mono text-xs font-normal text-muted-foreground">
                ({history.length})
              </span>
            )}
          </CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            Los resultados de combate apareceran aqui
          </div>
        ) : (
          <ScrollArea className="h-[280px]">
            <div className="flex flex-col gap-2 pr-3">
              {reversed.map((r) => {
                const config = DAMAGE_TYPE_CONFIG[r.damageType]
                return (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                      r.isCritical
                        ? "border border-accent/20 bg-accent/5"
                        : "bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-md"
                        style={{ backgroundColor: config.color + "22" }}
                      >
                        {r.action === "divine-smite" ? (
                          <Sun className="h-4 w-4" style={{ color: config.color }} />
                        ) : (
                          <Flame className="h-4 w-4" style={{ color: config.color }} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {r.action === "divine-smite" ? "Castigo Divino" : "Aliento"}
                          {r.isCritical && (
                            <span className="ml-1.5 text-accent">CRIT</span>
                          )}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground/70">
                          {r.damageDice}{" "}
                          <span style={{ color: config.color }}>{config.label.toLowerCase()}</span>
                          {r.action === "dragon-breath" && r.targetSaved && " (mitad)"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-xl font-black"
                        style={{ color: config.color }}
                      >
                        {r.damageTotal}
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
