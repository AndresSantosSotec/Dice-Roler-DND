
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Skull, Hand, Activity, Zap } from "lucide-react"
import type { CombatRollResult } from "./combat-types"
import { rollDie, rollMultiple, generateId } from "./combat-types"

interface QuiveringPalmPanelProps {
    onResult: (result: CombatRollResult) => void
    isRolling: boolean
    setIsRolling: (v: boolean) => void
}

export function QuiveringPalmPanel({ onResult, isRolling, setIsRolling }: QuiveringPalmPanelProps) {
    const [phase, setPhase] = useState<"strike" | "activate">("strike")
    const [attackMod, setAttackMod] = useState(8) // Default +8
    const [saveDC, setSaveDC] = useState(17) // Default 17
    const [targetSaveMod, setTargetSaveMod] = useState(3)

    const handleStrike = () => {
        setIsRolling(true)

        setTimeout(() => {
            // Attack roll
            const d20 = rollDie(20)
            const attackTotal = d20 + attackMod
            const isCritical = d20 === 20
            const isMiss = d20 === 1

            // Damage (1d10 + 5) - simple fallback damage for strike
            // Wait, user said: Attack 1d20+8, Damage 1d10+5 force/bludgeoning.
            const damageDice = rollDie(10)
            const damageTotal = damageDice + 5 + (isCritical ? rollDie(10) : 0)

            const result: CombatRollResult = {
                id: generateId(),
                action: "quivering-palm",
                timestamp: Date.now(),
                attackRoll: d20,
                attackModifier: attackMod,
                attackTotal,
                isCritical,
                isMiss,
                rollMode: "normal",
                damageRolls: [damageDice], // simplified
                damageDice: isCritical ? "2d10+5" : "1d10+5",
                damageTotal: damageTotal,
                damageType: "bludgeoning",
                bonusDamage: 5,
                label: `Palma Vibrante - Golpe Inicial`,
            }

            onResult(result)
            setIsRolling(false)
            // Switch phase to allow activation next
            setPhase("activate")
        }, 800)
    }

    const handleActivate = () => {
        setIsRolling(true)

        setTimeout(() => {
            // Saving throw
            const targetSavingThrow = rollDie(20) + targetSaveMod
            const targetSaved = targetSavingThrow >= saveDC

            let damageTotal = 0
            let damageRolls: number[] = []
            let isInstantDeath = false

            if (targetSaved) {
                // 10d10 necrotic
                damageRolls = rollMultiple(10, 10)
                damageTotal = damageRolls.reduce((a, b) => a + b, 0)
            } else {
                // Instant Death
                isInstantDeath = true
                damageTotal = 999 // Symbolic high damage
                damageRolls = []
            }

            const result: CombatRollResult = {
                id: generateId(),
                action: "quivering-palm",
                timestamp: Date.now(),
                attackModifier: 0,
                isCritical: false,
                isMiss: false,
                rollMode: "normal",
                damageRolls,
                damageDice: targetSaved ? "10d10" : "MUERTE",
                damageTotal,
                damageType: "necrotic",
                bonusDamage: 0,
                savingThrowDC: saveDC,
                targetSavingThrow,
                targetSaved,
                isInstantDeath,
                label: `Palma Vibrante - Activacion${targetSaved ? " (Salvado: 10d10 daño)" : " (FALLO: MUERTE INSTANTANEA)"}`,
            }

            onResult(result)
            setIsRolling(false)
            // Reset phase? Maybe keep it open to strike again?
            // User says "You can end these vibrations...". Usually consumes resources. Let's keep it on activate or reset manually.
        }, 1200)
    }

    return (
        <Card className="border-border bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Hand className="h-5 w-5 text-amber-400" />
                    Palma Vibrante (Quivering Palm)
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">

                {/* Phase Selector Checkbox/Toggle visual */}
                <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                    <Button
                        variant={phase === "strike" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => setPhase("strike")}
                    >
                        👊 Golpe Inicial
                    </Button>
                    <Button
                        variant={phase === "activate" ? "destructive" : "ghost"}
                        className="flex-1"
                        onClick={() => setPhase("activate")}
                    >
                        💀 Activar
                    </Button>
                </div>

                {phase === "strike" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                        <div className="rounded-lg bg-secondary/50 p-3">
                            <p className="text-sm text-muted-foreground text-center">
                                Realiza un ataque desarmado. Si golpea, puedes gastar 3 Ki para iniciar las vibraciones letales.
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <Label>Modificador de Ataque</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAttackMod(m => m - 1)}>-</Button>
                                <span className="font-mono font-bold w-6 text-center">{attackMod >= 0 ? "+" : ""}{attackMod}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAttackMod(m => m + 1)}>+</Button>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                            onClick={handleStrike}
                            disabled={isRolling}
                        >
                            {isRolling ? "Golpeando..." : "👊 Realizar Golpe Inicial"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                            <p className="text-sm text-destructive text-center font-bold">
                                ⚠️ TERMINAR VIBRACIONES
                            </p>
                            <p className="text-xs text-muted-foreground text-center mt-1">
                                La criatura debe realizar una salvación de Constitución. Si falla, se reduce a 0 HP. Si tiene éxito, recibe 10d10 de daño necrótico.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs">DC Salvacion</Label>
                                <Input type="number" value={saveDC} onChange={e => setSaveDC(Number(e.target.value))} className="font-mono" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs">Mod. Objetivo</Label>
                                <Input type="number" value={targetSaveMod} onChange={e => setTargetSaveMod(Number(e.target.value))} className="font-mono" />
                            </div>
                        </div>

                        <Button
                            size="lg"
                            variant="destructive"
                            className="w-full font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                            onClick={handleActivate}
                            disabled={isRolling}
                        >
                            {isRolling ? "Detonando..." : "💀 ACTIVAR VIBRACION"}
                        </Button>
                    </div>
                )}

            </CardContent>
        </Card>
    )
}
