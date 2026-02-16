
"use client"

import { useState } from "react"
import { useCharacters } from "@/hooks/use-characters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Play,
    RotateCcw,
    Plus,
    Skull,
    User,
    Swords,
    Trash2,
    Dices,
    Flame,
    EyeOff,
    Zap,
    Snowflake,
    Frown,
    Loader2,
    X,
    Check,
} from "lucide-react"
import { calculateModifier } from "@/lib/utils"

interface Combatant {
    id: string
    name: string
    initiative: number
    dexMod: number
    isEnemy: boolean
    hp: number
    maxHp: number
    conditions: string[]
}

const CONDITIONS = [
    { id: "envenenado", label: "Envenenado", icon: Skull, color: "text-green-500", border: "border-green-500" },
    { id: "aturdido", label: "Aturdido", icon: Loader2, color: "text-amber-500", border: "border-amber-500" },
    { id: "cegado", label: "Cegado", icon: EyeOff, color: "text-gray-500", border: "border-gray-500" },
    { id: "paralizado", label: "Paralizado", icon: Zap, color: "text-yellow-500", border: "border-yellow-500" },
    { id: "asustado", label: "Asustado", icon: Frown, color: "text-purple-500", border: "border-purple-500" },
    { id: "en_llamas", label: "En llamas", icon: Flame, color: "text-orange-500", border: "border-orange-500" },
    { id: "ralentizado", label: "Ralentizado", icon: Snowflake, color: "text-blue-500", border: "border-blue-500" },
]

export function InitiativeTracker() {
    const { characters } = useCharacters()
    const [combatants, setCombatants] = useState<Combatant[]>([])
    const [round, setRound] = useState(1)
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
    const [combatStarted, setCombatStarted] = useState(false)

    // New combatant form
    const [newEnemyName, setNewEnemyName] = useState("")
    const [newEnemyInitMod, setNewEnemyInitMod] = useState(0)
    const [newEnemyHp, setNewEnemyHp] = useState(10)

    const addCharacter = (charId: string) => {
        const char = characters.find((c) => c.id === charId)
        if (!char) return
        const dexMod = calculateModifier(char.attributes.dexterity)
        setCombatants((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: char.name,
                initiative: 0, // Will be rolled
                dexMod,
                isEnemy: false,
                hp: char.currentHp,
                maxHp: char.maxHp,
                conditions: [],
            },
        ])
    }

    const addEnemy = () => {
        if (!newEnemyName) return
        setCombatants((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: newEnemyName,
                initiative: 0, // Will be rolled or set
                dexMod: newEnemyInitMod,
                isEnemy: true,
                hp: newEnemyHp,
                maxHp: newEnemyHp,
                conditions: [],
            },
        ])
        setNewEnemyName("")
        setNewEnemyHp(10)
        setNewEnemyInitMod(0)
    }

    const rollInitiative = () => {
        const rolled = combatants.map((c) => ({
            ...c,
            initiative: Math.floor(Math.random() * 20) + 1 + c.dexMod,
        }))
        // Sort descending
        rolled.sort((a, b) => b.initiative - a.initiative)
        setCombatants(rolled)
        setCombatStarted(true)
        setRound(1)
        setCurrentTurnIndex(0)
    }

    const nextTurn = () => {
        if (currentTurnIndex >= combatants.length - 1) {
            setCurrentTurnIndex(0)
            setRound((r) => r + 1)
        } else {
            setCurrentTurnIndex((i) => i + 1)
        }
    }

    const resetCombat = () => {
        setCombatStarted(false)
        setRound(1)
        setCurrentTurnIndex(0)
        // Optional: Clear combatants? Or keep them contextually?
        // Let's keep them but reset init
        setCombatants((prev) => prev.map((c) => ({ ...c, initiative: 0 })))
    }

    const removeCombatant = (id: string) => {
        setCombatants((prev) => prev.filter((c) => c.id !== id))
    }

    const toggleCondition = (combatantId: string, conditionId: string) => {
        setCombatants((prev) =>
            prev.map((c) => {
                if (c.id !== combatantId) return c
                const has = c.conditions.includes(conditionId)
                return {
                    ...c,
                    conditions: has
                        ? c.conditions.filter((x) => x !== conditionId)
                        : [...c.conditions, conditionId],
                }
            })
        )
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Swords className="h-5 w-5" />
                        Orden de Combate
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {combatStarted && (
                            <Badge variant="outline" className="text-lg font-bold">
                                Ronda {round}
                            </Badge>
                        )}
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={resetCombat}
                            title="Reiniciar Combate"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Helper to add combatants */}
                {!combatStarted && (
                    <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <span className="text-sm font-medium">Agregar Personaje</span>
                            <div className="flex gap-2">
                                <Select onValueChange={addCharacter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {characters.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-medium">Agregar Enemigo</span>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nombre (ej. Goblin)"
                                    value={newEnemyName}
                                    onChange={(e) => setNewEnemyName(e.target.value)}
                                    className="h-9"
                                />
                                <Button size="sm" onClick={addEnemy}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    placeholder="HP"
                                    value={newEnemyHp}
                                    onChange={(e) => setNewEnemyHp(Number(e.target.value))}
                                    className="h-8 w-20 text-xs"
                                />
                                <Input
                                    type="number"
                                    placeholder="Init Mod"
                                    value={newEnemyInitMod}
                                    onChange={(e) => setNewEnemyInitMod(Number(e.target.value))}
                                    className="h-8 w-20 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex justify-between">
                    {!combatStarted ? (
                        <Button className="w-full gap-2" onClick={rollInitiative}>
                            <Dices className="h-4 w-4" />
                            Tirar Iniciativa
                        </Button>
                    ) : (
                        <Button className="w-full gap-2" onClick={nextTurn}>
                            <Play className="h-4 w-4" />
                            Siguiente Turno
                        </Button>
                    )}
                </div>

                {/* Combatants List */}
                <div className="space-y-2">
                    {combatants.map((c, idx) => {
                        const isActive = combatStarted && idx === currentTurnIndex
                        return (
                            <div
                                key={c.id}
                                className={`flex flex-col gap-2 rounded-lg border p-3 transition-colors ${isActive
                                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                                        : "bg-card hover:bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono font-bold">
                                            {c.initiative}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{c.name}</span>
                                                {c.isEnemy ? (
                                                    <Skull className="h-3 w-3 text-destructive" />
                                                ) : (
                                                    <User className="h-3 w-3 text-blue-500" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>
                                                    HP: {c.hp}/{c.maxHp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground">
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {CONDITIONS.map((cond) => (
                                                    <DropdownMenuItem
                                                        key={cond.id}
                                                        onClick={() => toggleCondition(c.id, cond.id)}
                                                        className="gap-2"
                                                    >
                                                        <cond.icon className={`h-4 w-4 ${cond.color}`} />
                                                        <span>{cond.label}</span>
                                                        {c.conditions.includes(cond.id) && (
                                                            <Check className="ml-auto h-3 w-3" />
                                                        )}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {!combatStarted && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeCombatant(c.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                        {combatStarted && isActive && (
                                            <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Conditions Row */}
                                {c.conditions.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pl-11">
                                        {c.conditions.map((condId) => {
                                            const cond = CONDITIONS.find((x) => x.id === condId)
                                            if (!cond) return null
                                            const Icon = cond.icon
                                            return (
                                                <Badge
                                                    key={condId}
                                                    variant="outline"
                                                    className={`h-5 gap-1 px-1 text-[10px] ${cond.border} ${cond.color} bg-background hover:bg-muted cursor-pointer`}
                                                    onClick={() => toggleCondition(c.id, condId)}
                                                >
                                                    <Icon className="h-3 w-3" />
                                                    {cond.label}
                                                    <X className="h-2 w-2 opacity-50" />
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    {combatants.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground">
                            Agrega combatientes para comenzar
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
