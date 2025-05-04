import type {Props} from "@/components/learnRounds/types";
import {type FormEvent, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";

export default function Write({ card, answer, hint }: Props & { hint?: string }) {
    const [value, setValue] = useState('')
    const [result, setResult] = useState<boolean|null>(null)

    function continueToNext(correct: boolean) {
        setValue('')
        setResult(null)
        answer(correct)
    }

    function check(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const correct = card.wordB.trim() === value.trim()
        if (correct) setTimeout(() => {
            continueToNext(correct)
        }, 1000)
        setResult(correct)
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <h1 className={"text-4xl"}>{card.wordA}</h1>

            <form
                className={'flex flex-col gap-4'}
                onSubmit={check}
            >
                {hint && <span className={"text-left text-2xl"}>Hint: {hint}</span>}
                <Input autoFocus disabled={result !== null} value={value} onChange={(e) => setValue(e.target.value)} />
                <Button disabled={result !== null} type="submit">Continue</Button>
            </form>

            {result !== null && (
                <div className={`-mx-6 -mb-6 p-6 ${result ? 'bg-green-400' : 'bg-red-400'}`}>
                    {result && <span className={"text-2xl"}>That's correct!</span>}
                    {!result && (
                        <div className={"flex justify-between items-center"}>
                            <div className={"flex flex-col gap-2"}>
                                <p className={"text-xl text-left"}>Correct answer</p>
                                <p className={"text-left"}>{card.wordB}</p>
                            </div>
                            <div className={"flex gap-4"}>
                                <Button onClick={() => continueToNext(true)} variant={"secondary"}><Check /> Accept as correct</Button>
                                <Button onClick={() => continueToNext(false)}>Continue</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
