
"use client"

import { useState, useEffect } from "react"
import { Character, CharacterClass, Attributes } from "@/components/character/character-types"

const STORAGE_KEY = "dnd-characters"

const defaultAttributes: Attributes = {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
}

const defaultSpellSlots = {
    level1: { current: 0, max: 0 },
    level2: { current: 0, max: 0 },
    level3: { current: 0, max: 0 },
    level4: { current: 0, max: 0 },
    level5: { current: 0, max: 0 },
}

export function useCharacters() {
    const [characters, setCharacters] = useState<Character[]>([])

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                setCharacters(JSON.parse(stored))
            } catch (e) {
                console.error("Failed to parse characters", e)
            }
        }
    }, [])

    const saveCharacters = (newCharacters: Character[]) => {
        setCharacters(newCharacters)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCharacters))
    }

    const addCharacter = (character: Omit<Character, "id" | "createdAt">) => {
        const newCharacter: Character = {
            ...character,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        }
        saveCharacters([...characters, newCharacter])
    }

    const updateCharacter = (updatedCharacter: Character) => {
        const newCharacters = characters.map((c) =>
            c.id === updatedCharacter.id ? updatedCharacter : c
        )
        saveCharacters(newCharacters)
    }

    const deleteCharacter = (id: string) => {
        const newCharacters = characters.filter((c) => c.id !== id)
        saveCharacters(newCharacters)
    }

    return {
        characters,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        defaultAttributes,
        defaultSpellSlots,
    }
}
