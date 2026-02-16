"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResultsTableProps {
  frequencyData: { face: number; count: number; percent: number }[]
  totalRolls: number
}

export function ResultsTable({ frequencyData, totalRolls }: ResultsTableProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Tabla de Resultados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalRolls === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Sin datos
          </div>
        ) : (
          <ScrollArea className="h-[360px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Cara</th>
                  <th className="pb-2 text-right font-medium">Conteo</th>
                  <th className="pb-2 text-right font-medium">Obtenido</th>
                  <th className="pb-2 text-right font-medium">Teorico</th>
                  <th className="pb-2 text-right font-medium">Diff</th>
                </tr>
              </thead>
              <tbody>
                {frequencyData.map((row) => {
                  const theoretical = 5
                  const diff = row.percent - theoretical
                  return (
                    <tr
                      key={row.face}
                      className={`border-b border-border/50 text-sm transition-colors hover:bg-secondary/50 ${
                        row.face === 20 ? "bg-accent/5" : ""
                      }`}
                    >
                      <td className="py-2 text-left">
                        <span
                          className={`font-mono font-bold ${
                            row.face === 20 ? "text-accent" : row.face === 1 ? "text-destructive" : "text-foreground"
                          }`}
                        >
                          {row.face}
                        </span>
                        {row.face === 20 && (
                          <span className="ml-2 text-xs text-accent">CRIT</span>
                        )}
                        {row.face === 1 && (
                          <span className="ml-2 text-xs text-destructive">FAIL</span>
                        )}
                      </td>
                      <td className="py-2 text-right font-mono text-foreground">
                        {row.count.toLocaleString()}
                      </td>
                      <td className="py-2 text-right font-mono text-foreground">
                        {row.percent.toFixed(2)}%
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">5.00%</td>
                      <td
                        className={`py-2 text-right font-mono ${
                          diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff.toFixed(2)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
