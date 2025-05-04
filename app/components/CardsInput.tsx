import type {ControllerRenderProps} from "react-hook-form";
import {useMemo} from "react";
import {cardSchema} from "@shared/schemas";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus, TrashIcon} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    function addPair() {
        value.push({
            wordA: '',
            wordB: ''
        })
        onChange([...value])
    }

    return (
        <div className={"flex flex-col gap-2"}>
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
                onClick={addPair}
            >
                <Plus /> Add another pair
            </Button>
        </div>
    )
}
