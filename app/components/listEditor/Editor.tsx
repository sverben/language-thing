import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createListSchema} from "@shared/schemas";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useMutation} from "convex/react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import CardsInput from "@/components/listEditor/CardsInput";
import ImportCards from "@/components/listEditor/ImportCards";
import {useNavigate} from "react-router";
import { api } from "convex/_generated/api";
import LanguageSelector from "@/components/LanguageSelector";
import {Card, CardContent} from "@/components/ui/card";

export default function Create({ defaults, submit, action }: { defaults?: typeof createListSchema._type, submit: (data: typeof createListSchema._type) => Promise<void>, action: string }) {
    const form = useForm({
        resolver: zodResolver(createListSchema),
        defaultValues: defaults || {
            name: '',
            cards: new Array(10).fill(null).map(() => ({ wordA: '', wordB: '' })),
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className={"space-y-8 mb-16"}>
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
                            <Card>
                                <CardContent className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-4"}>
                                        {["languageA", "languageB"].map(name => (
                                            <FormField
                                                control={form.control}
                                                key={name}
                                                name={name as "languageA" | "languageB"}
                                                render={({ field }) => (
                                                    <FormItem className={"flex-1"}>
                                                        <FormLabel>Select language</FormLabel>
                                                        <FormControl>
                                                            <LanguageSelector value={field.value} onChange={field.onChange} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <ImportCards {...field} />
                                </CardContent>
                            </Card>

                            <FormControl>
                                <CardsInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className={"bg-neutral-200 fixed left-0 right-0 bottom-0"}>
                    <div className={"flex justify-end p-4 max-w-7xl mx-auto"}>
                        <Button type="submit">{action}</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
