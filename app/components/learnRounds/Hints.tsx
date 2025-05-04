import type {Props} from "@/components/learnRounds/types";
import Write from "@/components/learnRounds/Write";
import {useMemo} from "react";

function getHint(word: string) {
    return word.split(' ').map(e => e.slice(0, 1) + new Array(e.length - 1).fill('').join('*')).join(' ');
}

export default function Hints(props: Props) {
    const hint = useMemo(() => getHint(props.card.wordB), [props.card.wordB]);

    return (
        <Write {...props} hint={hint} />
    )
}
