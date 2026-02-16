
"use client"

import { useState } from "react"
import { useCharacters } from "@/hooks/use-characters"
import { Character } from "./character-types"
import { CharacterCard } from "@/components/character/character-card"
import { CharacterForm } from "@/components/character/character-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus } from "lucide-react"

export function CharacterList() {
    const { characters, addCharacter, updateCharacter, deleteCharacter } =
        useCharacters()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCharacter, setEditingCharacter] = useState<Character | undefined>(
        undefined
    )

    const handleCreate = (data: Omit<Character, "id" | "createdAt">) => {
        addCharacter(data)
        setIsDialogOpen(false)
    }

    const handleUpdate = (data: Omit<Character, "id" | "createdAt">) => {
        if (editingCharacter) {
            updateCharacter({
                ...editingCharacter,
                ...data,
            })
            setEditingCharacter(undefined)
            setIsDialogOpen(false)
        }
    }

    const openCreateDialog = () => {
        setEditingCharacter(undefined)
        setIsDialogOpen(true)
    }

    const openEditDialog = (character: Character) => {
        setEditingCharacter(character)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de eliminar este personaje?")) {
            deleteCharacter(id)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Mis Personajes</h2>
                <Button onClick={openCreateDialog} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Crear Personaje
                </Button>
            </div>

            {characters.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center text-muted-foreground">
                    <UserPlus className="h-12 w-12 opacity-20" />
                    <h3 className="mt-4 text-lg font-semibold">No tienes personajes</h3>
                    <p className="text-sm">Empieza creando uno nuevo para tus partidas.</p>
                    <Button variant="outline" onClick={openCreateDialog} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear ahora
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {characters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onEdit={openEditDialog}
                            onDelete={handleDelete}
                        // onSelect not implemented yet, maybe for Initative later
                        />
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCharacter ? "Editar Personaje" : "Nuevo Personaje"}
                        </DialogTitle>
                        <DialogDescription>
                            Completa los detalles de tu personaje.
                        </DialogDescription>
                    </DialogHeader>
                    <CharacterForm
                        initialData={editingCharacter}
                        onSubmit={editingCharacter ? handleUpdate : handleCreate}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
