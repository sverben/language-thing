import type {Props} from "@/components/learnRounds/types";
import {useMemo, useState} from "react";
import {shuffleArray} from "@/lib/utils";
import {Button} from "@/components/ui/button";

export default function Choose({ cards, card, answer }: Props) {
    const options = useMemo(() => shuffleArray([...shuffleArray(cards).filter(e => e.wordA !== card.wordA && e.wordB !== card.wordB).slice(0, 3), card]), [card])
    const [result, setResult] = useState<string|null>(null);

    function click(value: string) {
        setResult(value);

        const correct = card.wordB === value
        setTimeout(() => {
            setResult(null)
            answer(correct)
        }, correct ? 1000 : 3000)
    }

    return (
        <div className={"flex flex-col gap-4"}>
            <h1 className={"text-4xl"}>{card.wordA}</h1>

            <div className={"flex flex-col gap-2"}>
                {options.map((option, index) => (
                    <Button
                        onClick={() => click(option.wordB)}
                        variant={"secondary"}
                        disabled={!!result}
                        className={`${result !== null && (card.wordB === option.wordB ? 'bg-green-400' : (result === option.wordB ? 'bg-red-400' : ''))} disabled:opacity-100`}
                        key={index}
                    >
                        {option.wordB}
                    </Button>
                ))}
            </div>
        </div>
    )
}
