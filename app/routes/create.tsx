import type {Route} from "./+types/create";
import {createListSchema} from "@shared/schemas";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import {useNavigate} from "react-router";
import Editor from "@/components/listEditor/Editor";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Create() {
    const createList = useMutation(api.lists.create);
    const navigate = useNavigate();

    async function submit(data: typeof createListSchema._type) {
        await createList(data)
        navigate('/')
    }

    return (
        <Editor submit={submit} action={'Create'} />
    )
}
