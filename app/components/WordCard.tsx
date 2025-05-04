import {Card, CardTitle} from "@/components/ui/card";
import {cardSchema} from "@shared/schemas";
import {useEffect, useRef, useState} from "react";

type Card = typeof cardSchema._type

export default function WordCard({ card, active }: { card: Card, active: boolean }) {
    const [side, setSide] = useState(true);
    const sideRef = useRef(true)

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.code !== 'Space') return

            flip()
        }

        if (active) document.addEventListener("keypress", onKey)
        return () => document.removeEventListener("keypress", onKey)
    }, [active])

    function flip() {
        sideRef.current = !sideRef.current
        setSide(sideRef.current)
    }

    return (
        <Card onClick={flip} className={"h-96 flex justify-center items-center"}>
            <CardTitle className={"text-4xl"}>{side ? card.wordA : card.wordB}</CardTitle>
        </Card>
    )
}
