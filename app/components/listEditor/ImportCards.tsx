import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {type ControllerRenderProps, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import CardsInput from "@/components/listEditor/CardsInput";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {cardSchema} from "@shared/schemas";
import {useState} from "react";

type Card = typeof cardSchema._type
type Props = ControllerRenderProps<{ cards: Card[] }, "cards">;

const importCardsSchema = z.object({
    separator: z.enum(['tab', 'equals']),
    content: z.string()
})

export default function ImportCards({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(importCardsSchema),
        defaultValues: {
            separator: 'tab' as 'tab',
            content: ''
        }
    })

    function importCards(data: typeof importCardsSchema._type) {
        const cards = data
            .content.split('\n')
            .map(e => e.trim())
            .filter(e => e !== '')
            .map(card => {
                const [wordA, wordB] = card.split(data.separator === 'tab' ? '\t' : '=').map(e => e.trim())

                return { wordA: wordA || '', wordB: wordB || '' }
            })

        onChange([...value, ...cards].filter(card => card.wordA !== '' || card.wordB !== ''))
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary"}>Import cards</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Import cards</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <div className={"space-y-8"}>
                        <FormField
                            control={form.control}
                            name="separator"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Separator</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="tab" id="tab" />
                                                <Label htmlFor="tab">Tab</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="equals" id="equals" />
                                                <Label htmlFor="equals">Equals sign (=)</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea className={"h-48 resize-none"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={form.handleSubmit(importCards)}>Import</Button>
                            <DialogClose asChild>
                                <Button type={"button"} variant={"secondary"}>Close</Button>
                            </DialogClose>
                        </div>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
