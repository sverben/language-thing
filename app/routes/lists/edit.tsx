import type {Route} from "./+types/list";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import Editor from "@/components/listEditor/Editor";
import {useNavigate} from "react-router";
import type {createListSchema} from "@shared/schemas";

export default function Edit({ params }: Route.ComponentProps) {
    const navigate = useNavigate()
    const updateList = useMutation(api.lists.update)
    const list = useQuery(api.lists.get, { id: params.id })
    if (!list) return

    async function submit(data: typeof createListSchema._type) {
        await updateList({
            id: params.id,
            ...data
        })
        navigate(`/lists/${params.id}`)
    }

    return (
        <Editor defaults={list} action={"Update"} submit={submit} />
    )
}
