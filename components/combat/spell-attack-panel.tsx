
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Flame, Snowflake, Zap, Droplets, Skull, Wind, Waves, Sword, Star, AlertTriangle, Moon } from "lucide-react"
import type { CombatRollResult, DamageType, CombatAction } from "./combat-types"
import { DAMAGE_TYPE_CONFIG, rollDie, rollMultiple, generateId } from "./combat-types"

interface SpellConfig {
    action: CombatAction
    label: string
    level: number
    damageDiceCount: number
    damageDiceSides: number
    damageType: DamageType
    defaultDC: number
    saveAttribute: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA"
    saveEffect: "half" | "none"
    icon: any
    bonusDamage?: number
    description?: string
}

export const SPELL_CONFIGS: Record<string, SpellConfig> = {
    fireball: {
        action: "fireball",
        label: "Bola de Fuego",
        level: 3,
        damageDiceCount: 8,
        damageDiceSides: 6,
        damageType: "fire",
        defaultDC: 15,
        saveAttribute: "DEX",
        saveEffect: "half",
        icon: Flame,
        description: "Radio 20 pies duele a todos"
    },
    "chain-lightning": {
        action: "chain-lightning",
        label: "Cadena de Relámpagos",
        level: 6,
        damageDiceCount: 10,
        damageDiceSides: 8,
        damageType: "lightning",
        defaultDC: 16,
        saveAttribute: "DEX",
        saveEffect: "half",
        icon: Zap,
        description: "Salta a 3 objetivos extra"
    },
    tsunami: {
        action: "tsunami",
        label: "Ola Destructora",
        level: 5,
        damageDiceCount: 6,
        damageDiceSides: 10,
        damageType: "bludgeoning",
        defaultDC: 15,
        saveAttribute: "STR",
        saveEffect: "half", // Actually successful save avoids prone/push, half damage
        icon: Waves,
    },
    whirlwind: {
        action: "whirlwind",
        label: "Torbellino",
        level: 7,
        damageDiceCount: 10,
        damageDiceSides: 6,
        damageType: "bludgeoning",
        defaultDC: 16,
        saveAttribute: "DEX",
        saveEffect: "half",
        icon: Wind,
    },
    "cone-of-cold": {
        action: "cone-of-cold",
        label: "Cono de Frío",
        level: 5,
        damageDiceCount: 8,
        damageDiceSides: 8,
        damageType: "ice",
        defaultDC: 15,
        saveAttribute: "CON",
        saveEffect: "half",
        icon: Snowflake,
    },
    disintegrate: {
        action: "disintegrate",
        label: "Desintegrar",
        level: 6,
        damageDiceCount: 10,
        damageDiceSides: 6,
        damageType: "force",
        defaultDC: 16,
        saveAttribute: "DEX",
        saveEffect: "none",
        bonusDamage: 40,
        icon: Star,
    },
    "meteor-swarm": {
        action: "meteor-swarm",
        label: "Lluvia de Meteoros",
        level: 9,
        damageDiceCount: 40,
        damageDiceSides: 6,
        damageType: "fire", // Simplified to fire for panel, real is mixed
        defaultDC: 17,
        saveAttribute: "DEX",
        saveEffect: "half",
        icon: AlertTriangle,
        description: "Total 40d6 (20d6 fuego + 20d6 contundente)"
    },
    "hunger-of-hadar": {
        action: "hunger-of-hadar",
        label: "Hambre de Hadar",
        level: 3,
        damageDiceCount: 2,
        damageDiceSides: 6,
        damageType: "ice", // Variable
        defaultDC: 14,
        saveAttribute: "DEX",
        saveEffect: "none", // Complex
        icon: Moon,
        description: "2d6 frio (sin salv) o 2d6 acido (salv)"
    }
}

interface SpellAttackPanelProps {
    spellId: string
    onResult: (result: CombatRollResult) => void
    isRolling: boolean
    setIsRolling: (v: boolean) => void
}

export function SpellAttackPanel({ spellId, onResult, isRolling, setIsRolling }: SpellAttackPanelProps) {
    const config = SPELL_CONFIGS[spellId]

    if (!config) return <div>Spell not found: {spellId}</div>

    const [castLevel, setCastLevel] = useState(config.level)
    const [dc, setDc] = useState(config.defaultDC)
    const [targetSaveMod, setTargetSaveMod] = useState(3)

    // Calculate dice based on upcast if needed (simplified: user can just edit dice manually if they want, 
    // or we add upcast logic. For now, flat config or manual tweak)
    // Let's add manual dice tweak since D&D spells scale differently.
    const [diceCount, setDiceCount] = useState(config.damageDiceCount)

    const handleCast = () => {
        setIsRolling(true)

        setTimeout(() => {
            // Damage
            const damageRolls = rollMultiple(diceCount, config.damageDiceSides)
            let damageTotal = damageRolls.reduce((a, b) => a + b, 0)
            if (config.bonusDamage) damageTotal += config.bonusDamage

            // Save
            const targetSavingThrow = rollDie(20) + targetSaveMod
            const targetSaved = targetSavingThrow >= dc

            if (targetSaved) {
                if (config.saveEffect === "half") damageTotal = Math.floor(damageTotal / 2)
                else if (config.saveEffect === "none") damageTotal = 0
            }

            const result: CombatRollResult = {
                id: generateId(),
                action: config.action,
                timestamp: Date.now(),
                attackModifier: 0,
                isCritical: false,
                isMiss: false,
                rollMode: "normal",
                damageRolls,
                damageDice: `${diceCount}d${config.damageDiceSides}${config.bonusDamage ? `+${config.bonusDamage}` : ''}`,
                damageTotal,
                damageType: config.damageType,
                bonusDamage: config.bonusDamage || 0,
                savingThrowDC: dc,
                targetSavingThrow,
                targetSaved,
                label: `${config.label} (Nv ${castLevel})${targetSaved ? ` - Salvacion exitosa (${config.saveEffect === 'half' ? 'mitad' : 'evadido'})` : " - Fallo en salvacion"}`,
            }

            onResult(result)
            setIsRolling(false)
        }, 1000)
    }

    const damageConfig = DAMAGE_TYPE_CONFIG[config.damageType]
    const Icon = config.icon

    return (
        <Card className="border-border bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Icon className="h-5 w-5" style={{ color: damageConfig.color }} />
                    {config.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">

                {/* Config Inputs */}
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-secondary/50 p-3">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">Nivel</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline" size="icon" className="h-8 w-8"
                                onClick={() => {
                                    const newLvl = Math.max(1, castLevel - 1)
                                    setCastLevel(newLvl)
                                    // Simple heuristic for upcast: +1 die per level usually
                                    // But strictly it varies. Let's just let user adjust dice manually or rely on base.
                                }}
                            >-</Button>
                            <span className="font-mono font-bold">{castLevel}</span>
                            <Button
                                variant="outline" size="icon" className="h-8 w-8"
                                onClick={() => setCastLevel(castLevel + 1)}
                            >+</Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">Dados ({config.damageDiceSides})</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline" size="icon" className="h-8 w-8"
                                onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                            >-</Button>
                            <span className="font-mono font-bold">{diceCount}</span>
                            <Button
                                variant="outline" size="icon" className="h-8 w-8"
                                onClick={() => setDiceCount(diceCount + 1)}
                            >+</Button>
                        </div>
                    </div>
                </div>

                {/* DC & Save */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            DC Salvacion ({config.saveAttribute})
                        </Label>
                        <Input
                            type="number"
                            value={dc}
                            onChange={e => setDc(Number(e.target.value))}
                            className="w-16 h-8 text-center font-mono"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Mod. Salvacion Objetivo
                        </Label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setTargetSaveMod((v) => v - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80"
                            >
                                -
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center rounded-md bg-secondary font-mono text-base font-bold text-foreground">
                                {targetSaveMod >= 0 ? "+" : ""}{targetSaveMod}
                            </span>
                            <button
                                type="button"
                                onClick={() => setTargetSaveMod((v) => v + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <p className="text-sm font-mono text-muted-foreground">
                        {diceCount}d{config.damageDiceSides}{config.bonusDamage ? `+${config.bonusDamage}` : ''} {damageConfig.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {config.description}
                    </p>
                </div>

                {/* Roll Button */}
                <Button
                    size="lg"
                    onClick={handleCast}
                    disabled={isRolling}
                    className="w-full py-6 text-lg font-bold shadow-lg"
                    style={{
                        backgroundColor: damageConfig.color,
                        color: ["lightning", "ice", "acid"].includes(config.damageType) ? "#1a1a2e" : "#ffffff",
                        boxShadow: `0 0 20px ${damageConfig.color}40`,
                    }}
                >
                    <Icon className="mr-2 h-6 w-6" />
                    {isRolling ? "Lanzando..." : `Lanzar ${config.label}`}
                </Button>

            </CardContent>
        </Card>
    )
}
