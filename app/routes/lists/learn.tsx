import type {Route} from "./+types/list";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {type JSX, useEffect, useMemo, useRef, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import type {FunctionReturnType} from "convex/server";
import type {cardSchema} from "@shared/schemas";
import { shuffleArray } from "@/lib/utils";
import type {Props} from "@/components/learnRounds/types";
import Write from "@/components/learnRounds/Write";
import Choose from "@/components/learnRounds/Choose";
import Show from "@/components/learnRounds/Show";
import Hints from "@/components/learnRounds/Hints";

type Card = typeof cardSchema._type
type Component = ({ card, answer }: Props) => JSX.Element;

const MAX_CONCURRENT_WORDS = 6
const ROUNDS: Component[] = [Show, Choose, Hints, Write]

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

type DefinedRound = { round: number, component: Component, card: Card }
type Round = { round: -1 } | { round: number, component: Component, card: Card }

function LearnTrack({ list }: { list: FunctionReturnType<typeof api.lists.get> & {} }) {
    const cards = useRef(shuffleArray(list.cards))
    const [rounds, setRounds] = useState<Round[]>([
        {
            round: -1
        }
    ])

    useEffect(() => {
        if (rounds[0].round >= 0) return

        rounds.splice(0, 1)
        for (let i = 0; i < 2; i++) {
            if (rounds.length < MAX_CONCURRENT_WORDS) {
                const card = cards.current.pop()
                if (card) rounds.unshift({
                    round: 0,
                    component: ROUNDS[0],
                    card
                })
            }
        }
        rounds.push({
            round: -1
        })
        setRounds([...rounds])
    }, [rounds])

    const Component = useMemo(() => (rounds[0] as DefinedRound).component, [rounds])

    function answer(correct: boolean) {
        const round = rounds[0] as DefinedRound
        rounds.splice(0, 1)

        if (!correct) return setRounds([...rounds, round])
        if (round.round >= ROUNDS.length - 1) return setRounds([...rounds])

        setRounds([...rounds, {
            ...round,
            round: round.round + 1,
            component: ROUNDS[round.round + 1]
        }])
    }

    return (
        <Card className={"overflow-hidden w-full max-w-2xl min-h-3/12 fixed top-1/2 left-1/2 -translate-1/2 justify-center"}>
            <CardContent className={"text-center"}>
                {rounds[0].round >= 0 && Component && <Component cards={list.cards} card={(rounds[0] as DefinedRound).card} answer={answer} />}
            </CardContent>
        </Card>
    );
}

export default function Learn({ params }: Route.ComponentProps) {
    const list = useQuery(api.lists.get, { id: params.id })
    if (!list) return

    return <LearnTrack list={list} />
}
