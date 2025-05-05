import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Pencil, Play, RefreshCw} from "lucide-react";
import type {createLearnSchema} from "@shared/schemas";
import {useNavigate} from "react-router";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";

export default function LearnButton({ list, label = "Practice all words" }: { list: string, label?: string }) {
    const navigate = useNavigate();
    const createLearningSession = useMutation(api.learnSessions.create)

    async function learn(type: typeof createLearnSchema._type['type']) {
        const id = await createLearningSession({
            list, type,
        })

        navigate(`/learn/${id}`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button><Play /> {label}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => learn('learn')}><RefreshCw /> Learn</DropdownMenuItem>
                <DropdownMenuItem onClick={() => learn('test')}><Pencil /> Test</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
