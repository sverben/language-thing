import type {Card, Props} from "@/components/learnRounds/types";
import {type FormEvent, useEffect, useMemo, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";

function findSpecialCharacters(inputString: string) {
    // First get all non-ASCII characters
    const nonAsciiMatches = inputString.match(/[^\x00-\x7F]/g) || [];

    // Then filter out excluded characters using regex
    // This includes hyphens, dashes, and various quote marks
    const excludePattern = /[\-–—'"…]/;

    return nonAsciiMatches.filter(char => !excludePattern.test(char));
}

function findUniqueCharacters(cards: Card[]) {
    const set = new Set()
    cards.forEach(card => {
        findSpecialCharacters(card.wordB).forEach(char => {
            set.add(char)
        })
    })

    return Array.from(set.values()) as string[]
}

export default function Write({ cards, card, answer, hint }: Props & { hint?: string }) {
    const [value, setValue] = useState('')
    const [result, setResult] = useState<boolean|null>(null)
    const position = useRef<number|null>(null)
    const specialCharacters = useMemo(() => findUniqueCharacters(cards), [cards])
    const input = useRef<HTMLInputElement>(null)

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

    useEffect(() => {
        if (!input.current) return

        function trackCursorPosition() {
            if (!input.current) return
            position.current = input.current.selectionStart
        }

        input.current.addEventListener('selectionchange', trackCursorPosition)
    }, [input])

    function type(char: string) {
        if (position.current) {
            const pos = position.current

            setValue(value.slice(0, pos) + char + value.slice(pos))
            input.current?.focus()
            setTimeout(() => {
                if (!input.current) return

                input.current.selectionStart = pos + 1
                input.current.selectionEnd = pos + 1
            }, 0)
            return
        }

        setValue(value + char)
        input.current?.focus()
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <h1 className={"text-4xl"}>{card.wordA}</h1>

            <form
                className={'flex flex-col gap-4'}
                onSubmit={check}
            >
                {hint && <span className={"text-left text-2xl"}>Hint: {hint}</span>}
                <Input ref={input} autoFocus disabled={result !== null} value={value} onChange={(e) => setValue(e.target.value)} />

                <div className={"flex flex-wrap gap-1"}>
                    {specialCharacters.map(char => (
                        <Button onClick={() => type(char)} type={"button"} variant={"secondary"} key={char}>{char}</Button>
                    ))}
                </div>

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
