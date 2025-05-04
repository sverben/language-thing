import type {ControllerRenderProps} from "react-hook-form";
import {type KeyboardEventHandler, useLayoutEffect, useMemo, useRef, useState} from "react";
import {cardSchema} from "@shared/schemas";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus, TrashIcon} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type KeyboardEvent} from "react";

type Card = typeof cardSchema._type
type Props = ControllerRenderProps<{ cards: Card[] }, "cards">;

function CardInput({ card, onChange, onDelete }: { card: Card, onChange: (card: Card) => void, onDelete: () => void }) {
    return (
        <Card>
            <CardContent className={"flex gap-4"}>
                <Input
                    value={card.wordA}
                    placeholder={"Word"}
                    onChange={(e) => onChange({
                        ...card,
                        wordA: e.target.value,
                    })}
                />
                <Input
                    value={card.wordB}
                    placeholder={"Meaning"}
                    onChange={(e) => onChange({
                        ...card,
                        wordB: e.target.value,
                    })}
                />
                <Button tabIndex={-1} type={"button"} variant={"destructive"} onClick={onDelete}>
                    <TrashIcon />
                </Button>
            </CardContent>
        </Card>
    )
}

export default function CardsInput({ value, onChange }: Props) {
    const [focus, setFocus] = useState<number|null>(null)
    const componentRef = useRef<HTMLDivElement>(null)

    function addPair() {
        value.push({
            wordA: '',
            wordB: ''
        })
        setFocus(value.length - 1)
        onChange([...value])
    }

    const onKeyUp: KeyboardEventHandler = (event) => {
        if (event.key !== 'Tab') return

        addPair()
    }

    useLayoutEffect(() => {
        if (focus === null || !componentRef.current) return

        const element = componentRef.current.children[focus]
        console.log(element)
        if (!(element instanceof HTMLDivElement)) return

        element.querySelector('input')?.focus()
        setFocus(null)
    }, [focus])

    return (
        <div ref={componentRef} className={"flex flex-col gap-2"}>
            {value.map((card, index) => (
                <CardInput
                    key={index}
                    card={card}
                    onChange={(card) => {
                        value[index] = card
                        onChange([...value])
                    }}
                    onDelete={() => {
                        value.splice(index, 1);
                        onChange([...value])
                    }}
                />
            ))}

            <Button
                type={"button"}
                variant={"secondary"}
                className={"p-6"}
                onKeyUp={onKeyUp}
                onClick={addPair}
            >
                <Plus /> Add another pair
            </Button>
        </div>
    )
}
