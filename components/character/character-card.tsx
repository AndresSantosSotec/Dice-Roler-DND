
import { Character, Attributes } from "./character-types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateModifier } from "@/lib/utils"
import { Settings, Trash2, Heart, Shield, Zap } from "lucide-react"

interface CharacterCardProps {
    character: Character
    onEdit: (character: Character) => void
    onDelete: (id: string) => void
    onSelect?: (character: Character) => void
}

export function CharacterCard({
    character,
    onEdit,
    onDelete,
    onSelect,
}: CharacterCardProps) {
    const mod = (score: number) => {
        const m = calculateModifier(score)
        return m >= 0 ? `+${m}` : `${m}`
    }

    return (
        <Card className="w-full max-w-sm border-2 transition-all hover:border-primary/50">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{character.name}</CardTitle>
                        <CardDescription>
                            Level {character.level} {character.class}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Prof: +{character.proficiencyBonus}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Vitals */}
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 p-2">
                    <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-mono text-sm font-bold">
                            {character.currentHp}/{character.maxHp}
                        </span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="font-mono text-sm font-bold">
                            {10 + calculateModifier(character.attributes.dexterity)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">AC</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    {Object.entries(character.attributes).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex flex-col items-center rounded border bg-card p-1 shadow-sm"
                        >
                            <span className="text-[10px] uppercase text-muted-foreground">
                                {key.slice(0, 3)}
                            </span>
                            <span className="text-sm font-bold">{value}</span>
                            <span className="text-[10px] text-primary">{mod(value)}</span>
                        </div>
                    ))}
                </div>

                {/* Spell Slots Preview (if any) */}
                {Object.values(character.spellSlots).some((s) => s.max > 0) && (
                    <div className="flex flex-wrap gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">Slots: </span>
                        {Object.entries(character.spellSlots).map(([lvl, slot]) => {
                            if (slot.max === 0) return null
                            const levelNum = lvl.replace("level", "")
                            return (
                                <Badge key={lvl} variant="secondary" className="h-4 px-1 text-[10px]">
                                    L{levelNum}: {slot.current}/{slot.max}
                                </Badge>
                            )
                        })}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/10 p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(character.id)}
                >
                    <Trash2 className="h-3 w-3" />
                    Borrar
                </Button>
                <div className="flex gap-2">
                    {onSelect && (
                        <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => onSelect(character)}
                        >
                            Seleccionar
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => onEdit(character)}
                    >
                        <Settings className="h-3 w-3" />
                        Editar
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
