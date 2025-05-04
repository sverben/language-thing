import type {Route} from "./+types/create";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createListSchema} from "@shared/schemas";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import CardsInput from "@/components/listEditor/CardsInput";
import ImportCards from "@/components/listEditor/ImportCards";
import {useNavigate} from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Create() {
    const createList = useMutation(api.lists.create);
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(createListSchema),
        defaultValues: {
            name: '',
            cards: new Array(10).fill(null).map(() => ({ wordA: '', wordB: '' })),
        }
    })

    async function submit(data: typeof createListSchema._type) {
        await createList(data)
        navigate('/')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className={"space-y-8"}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>List name</FormLabel>
                            <FormControl>
                                <Input placeholder={"Give your list a name"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cards"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cards</FormLabel>
                            <ImportCards {...field} />
                            <FormControl>
                                <CardsInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}
