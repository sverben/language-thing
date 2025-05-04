import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import type {Props} from "@/components/learnRounds/types";

export default function Show({ card, answer }: Props) {
    return (
        <div className={"flex flex-col gap-6"}>
            <h1 className={"text-4xl"}>{card.wordA}</h1>
            <Separator />
            <p className={"text-2xl"}>{card.wordB}</p>

            <div className={"flex justify-end"}>
                <Button onClick={() => answer(true)}>Continue</Button>
            </div>
        </div>
    )
}
