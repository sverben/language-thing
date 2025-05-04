import type {Route} from "./+types/learn";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {type JSX, useMemo} from "react";
import {Card, CardContent} from "@/components/ui/card";
import type {cardSchema} from "@shared/schemas";
import type {Props} from "@/components/learnRounds/types";
import Write from "@/components/learnRounds/Write";
import Choose from "@/components/learnRounds/Choose";
import Show from "@/components/learnRounds/Show";
import Hints from "@/components/learnRounds/Hints";
import {Progress} from "@/components/ui/progress";
import {Check, CheckCircle, CheckCircle2} from "lucide-react";

type Card = typeof cardSchema._type
type Component = ({ card, answer }: Props) => JSX.Element;

const rounds: Record<string, Component> = {
    show: Show,
    choose: Choose,
    hints: Hints,
    write: Write
}

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Learn({ params }: Route.ComponentProps) {
    const session = useQuery(api.learnSessions.get, { id: params.id })
    const next = useMutation(api.learnSessions.next)

    async function answer(correct: boolean) {
        await next({
            session: params.id,
            correct
        })
    }

    const done = useMemo(() => session && session.allCards.length - session.remaining.length - session.rounds.filter(round => round.kind === 'item').length, [session])
    const Component = useMemo(() => session?.rounds[0].kind === 'item' && rounds[session.enabledRoundTypes[session.rounds[0].round]], [session?.rounds[0]])

    if (!session || done === undefined) return
    return (
        <div className={"w-screen h-screen"}>
            <div className={"flex justify-center"}>
                <div className={"p-4 flex items-center w-full max-w-7xl mx-auto gap-4"}>
                    <Progress className={"h-5 flex-1"} value={done / session.allCards.length * 100} />
                    <div>{session.allCards.length - done} to go</div>
                    <div className={"flex gap-1 items-center"}>
                        <div className={"bg-primary aspect-square rounded-full p-0.5 text-white"}>
                            <Check size={20} />
                        </div>
                        {done}
                    </div>
                </div>
            </div>

            <Card className={"overflow-hidden w-full max-w-2xl min-h-3/12 fixed top-1/2 left-1/2 -translate-1/2 justify-center"}>
                <CardContent className={"text-center"}>
                    {session.rounds[0].kind === 'item' && Component && <Component cards={session.allCards} card={session.rounds[0].card} answer={answer} />}
                </CardContent>
            </Card>
        </div>
    );
}
