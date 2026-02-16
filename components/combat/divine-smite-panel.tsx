"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sun, Swords } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface DivineSmitePanelProps {
  onResult: (result: CombatRollResult) => void
  isRolling: boolean
  setIsRolling: (v: boolean) => void
}

const SPELL_SLOTS = [
  { level: 1, label: "Nivel 1", baseDice: 2 },
  { level: 2, label: "Nivel 2", baseDice: 3 },
  { level: 3, label: "Nivel 3", baseDice: 4 },
  { level: 4, label: "Nivel 4", baseDice: 5 },
]

export function DivineSmitePanel({ onResult, isRolling, setIsRolling }: DivineSmitePanelProps) {
  const [slotLevel, setSlotLevel] = useState(1)
  const [attackModifier, setAttackModifier] = useState(5)
  const [isUndead, setIsUndead] = useState(false)
  const [rollMode, setRollMode] = useState<"normal" | "advantage" | "disadvantage">("normal")

  const selectedSlot = SPELL_SLOTS.find((s) => s.level === slotLevel) ?? SPELL_SLOTS[0]
  const totalSmiteDice = selectedSlot.baseDice + (isUndead ? 1 : 0)

  const handleSmite = () => {
    setIsRolling(true)

    setTimeout(() => {
      // Attack roll
      let attackRoll: number
      let advantageRolls: [number, number] | undefined

      if (rollMode !== "normal") {
        const r1 = rollDie(20)
        const r2 = rollDie(20)
        advantageRolls = [r1, r2]
        attackRoll = rollMode === "advantage" ? Math.max(r1, r2) : Math.min(r1, r2)
      } else {
        attackRoll = rollDie(20)
      }

      const isCritical = attackRoll === 20
      const isMiss = attackRoll === 1
      const attackTotal = attackRoll + attackModifier

      // Smite damage (doubled on crit)
      const diceCount = isCritical ? totalSmiteDice * 2 : totalSmiteDice
      const damageRolls = rollMultiple(diceCount, 8)
      const damageTotal = damageRolls.reduce((a, b) => a + b, 0)

      const result: CombatRollResult = {
        id: generateId(),
        action: "divine-smite",
        timestamp: Date.now(),
        attackRoll,
        attackModifier,
        attackTotal,
        isCritical,
        isMiss,
        rollMode,
        advantageRolls,
        damageRolls,
        damageDice: `${diceCount}d8`,
        damageTotal,
        damageType: "radiant",
        bonusDamage: 0,
        smiteLevel: slotLevel,
        isUndead,
        label: `Castigo Divino ${isCritical ? "(CRITICO)" : ""} - Nivel ${slotLevel}${isUndead ? " (No-muerto)" : ""}`,
      }

      onResult(result)
      setIsRolling(false)
    }, 900)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Sun className="h-5 w-5" style={{ color: "#f5c842" }} />
          Castigo Divino (Divine Smite)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Spell slot level */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Nivel de espacio de conjuro
          </Label>
          <div className="flex gap-2">
            {SPELL_SLOTS.map((slot) => (
              <button
                key={slot.level}
                type="button"
                onClick={() => setSlotLevel(slot.level)}
                className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  slotLevel === slot.level
                    ? "bg-[#f5c842]/20 text-[#f5c842] ring-1 ring-[#f5c842]/40"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="font-bold">{slot.label}</span>
                <span className="font-mono text-xs opacity-70">{slot.baseDice}d8</span>
              </button>
            ))}
          </div>
        </div>

        {/* Attack modifier */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Modificador de ataque
          </Label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAttackModifier((v) => Math.max(-5, v - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80"
            >
              -
            </button>
            <span className="flex h-9 w-12 items-center justify-center rounded-md bg-secondary font-mono text-lg font-bold text-foreground">
              {attackModifier >= 0 ? "+" : ""}{attackModifier}
            </span>
            <button
              type="button"
              onClick={() => setAttackModifier((v) => Math.min(15, v + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80"
            >
              +
            </button>
          </div>
        </div>

        {/* Roll mode */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Modo de ataque
          </Label>
          <div className="flex flex-wrap gap-2">
            {(["normal", "advantage", "disadvantage"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRollMode(mode)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  rollMode === mode
                    ? mode === "advantage"
                      ? "bg-accent text-accent-foreground"
                      : mode === "disadvantage"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {mode === "normal" ? "Normal" : mode === "advantage" ? "Ventaja" : "Desventaja"}
              </button>
            ))}
          </div>
        </div>

        {/* Undead toggle */}
        <button
          type="button"
          onClick={() => setIsUndead(!isUndead)}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isUndead
              ? "bg-[#f5c842]/20 text-[#f5c842] ring-1 ring-[#f5c842]/40"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
            isUndead ? "border-[#f5c842] bg-[#f5c842]" : "border-muted-foreground"
          }`}>
            {isUndead && <span className="text-xs font-bold text-background">{"✓"}</span>}
          </div>
          {"Objetivo no-muerto o infernal (+1d8)"}
        </button>

        {/* Summary */}
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-center font-mono text-sm text-muted-foreground">
            Ataque: <span className="font-bold text-foreground">1d20{attackModifier >= 0 ? "+" : ""}{attackModifier}</span>
            {" | "}
            {"Daño: "}
            <span className="font-bold" style={{ color: "#f5c842" }}>
              {totalSmiteDice}d8 radiante
            </span>
            {" "}
            <span className="text-xs opacity-60">(x2 en critico)</span>
          </p>
        </div>

        {/* Roll button */}
        <Button
          size="lg"
          onClick={handleSmite}
          disabled={isRolling}
          className="w-full py-6 text-lg font-bold shadow-lg"
          style={{
            backgroundColor: "#f5c842",
            color: "#1a1a2e",
            boxShadow: "0 0 20px #f5c84240",
          }}
        >
          <Swords className="mr-2 h-6 w-6" />
          {isRolling ? "Invocando poder divino..." : "Castigo Divino"}
        </Button>
      </CardContent>
    </Card>
  )
}
