import type {Props} from "@/components/learnRounds/types";
import {useMemo} from "react";
import {shuffleArray} from "@/lib/utils";
import {Button} from "@/components/ui/button";

export default function Choose({ cards, card, answer }: Props) {
    const options = useMemo(() => shuffleArray([...shuffleArray(cards).slice(0, 3), card]), [card])

    return (
        <div className={"flex flex-col gap-4"}>
            <h1 className={"text-4xl"}>{card.wordA}</h1>

            <div className={"flex flex-col gap-2"}>
                {options.map((option, index) => (
                    <Button
                        onClick={() => answer(card.wordB === option.wordB)}
                        variant={"secondary"}
                        key={index}
                    >{option.wordB}</Button>
                ))}
            </div>
        </div>
    )
}
