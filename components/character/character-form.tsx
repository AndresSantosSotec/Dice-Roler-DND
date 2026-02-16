
"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Character,
    CharacterClass,
    Attributes,
    SpellSlots,
} from "./character-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { calculateModifier } from "@/lib/utils"

interface CharacterFormProps {
    initialData?: Character
    onSubmit: (character: Omit<Character, "id" | "createdAt">) => void
    onCancel: () => void
}

const CLASSES: CharacterClass[] = [
    "Barbarian",
    "Bard",
    "Cleric",
    "Druid",
    "Fighter",
    "Monk",
    "Paladin",
    "Ranger",
    "Rogue",
    "Sorcerer",
    "Warlock",
    "Wizard",
]

const SPELL_CLASSES = [
    "Bard",
    "Cleric",
    "Druid",
    "Paladin",
    "Ranger",
    "Sorcerer",
    "Warlock",
    "Wizard",
]

export function CharacterForm({
    initialData,
    onSubmit,
    onCancel,
}: CharacterFormProps) {
    const [name, setName] = useState(initialData?.name || "")
    const [charClass, setCharClass] = useState<CharacterClass>(
        initialData?.class || "Fighter"
    )
    const [level, setLevel] = useState(initialData?.level || 1)
    const [maxHp, setMaxHp] = useState(initialData?.maxHp || 10)
    const [currentHp, setCurrentHp] = useState(initialData?.currentHp || 10)
    const [attributes, setAttributes] = useState<Attributes>(
        initialData?.attributes || {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        }
    )

    const [spellSlots, setSpellSlots] = useState<SpellSlots>(
        initialData?.spellSlots || {
            level1: { current: 0, max: 0 },
            level2: { current: 0, max: 0 },
            level3: { current: 0, max: 0 },
            level4: { current: 0, max: 0 },
            level5: { current: 0, max: 0 },
        }
    )

    const profBonus = useMemo(() => {
        return Math.ceil(level / 4) + 1
    }, [level])

    const needsSpells = SPELL_CLASSES.includes(charClass)

    const handleAttributeChange = (key: keyof Attributes, value: number) => {
        setAttributes((prev) => ({ ...prev, [key]: value }))
    }

    const handleSpellSlotChange = (
        level: keyof SpellSlots,
        field: "current" | "max",
        val: number
    ) => {
        setSpellSlots((prev) => ({
            ...prev,
            [level]: { ...prev[level], [field]: val },
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            name: name || "Sin Nombre",
            class: charClass,
            level,
            maxHp,
            currentHp,
            attributes,
            spellSlots: needsSpells
                ? spellSlots
                : {
                    level1: { current: 0, max: 0 },
                    level2: { current: 0, max: 0 },
                    level3: { current: 0, max: 0 },
                    level4: { current: 0, max: 0 },
                    level5: { current: 0, max: 0 },
                },
            proficiencyBonus: profBonus,
        } as any) // Type assertion because id/createdAt are added by hook
    }

    // Modifiers display helper
    const mod = (score: number) => {
        const m = Math.floor((score - 10) / 2)
        return m >= 0 ? `+${m}` : `${m}`
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Theron"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Clase</Label>
                    <Select
                        value={charClass}
                        onValueChange={(v) => setCharClass(v as CharacterClass)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CLASSES.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Nivel (Bonif. Competencia: +{profBonus})</Label>
                    <div className="flex items-center gap-2">
                        <Slider
                            value={[level]}
                            onValueChange={([v]) => setLevel(v)}
                            min={1}
                            max={20}
                            step={1}
                            className="flex-1"
                        />
                        <span className="w-8 text-center font-bold">{level}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label>HP Máximo</Label>
                        <Input
                            type="number"
                            value={maxHp}
                            onChange={(e) => setMaxHp(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>HP Actual</Label>
                        <Input
                            type="number"
                            value={currentHp}
                            onChange={(e) => setCurrentHp(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-base font-semibold">Atributos</Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    {(Object.keys(attributes) as Array<keyof Attributes>).map((attr) => (
                        <div key={attr} className="flex flex-col items-center gap-1">
                            <Label className="uppercase text-xs text-muted-foreground">
                                {attr.slice(0, 3)}
                            </Label>
                            <Input
                                type="number"
                                className="h-9 text-center"
                                value={attributes[attr]}
                                onChange={(e) =>
                                    handleAttributeChange(attr, Number(e.target.value))
                                }
                            />
                            <span className="text-xs font-mono text-muted-foreground">
                                {mod(attributes[attr])}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {needsSpells && (
                <div className="space-y-3 rounded-lg border p-3 bg-muted/20">
                    <Label className="text-base font-semibold">Espacios de Conjuro (Max)</Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                            const key = `level${lvl}` as keyof SpellSlots
                            return (
                                <div key={lvl} className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Nivel {lvl}</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={spellSlots[key].max}
                                        onChange={(e) =>
                                            handleSpellSlotChange(key, "max", Number(e.target.value))
                                        }
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit">Guardar Personaje</Button>
            </div>
        </form>
    )
}
