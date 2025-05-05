import type {Route} from "./+types/learn";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {type JSX, useEffect, useMemo, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {type cardSchema, settingsSchema} from "@shared/schemas";
import type {Props} from "@/components/learnRounds/types";
import Write from "@/components/learnRounds/Write";
import Choose from "@/components/learnRounds/Choose";
import Show from "@/components/learnRounds/Show";
import Hints from "@/components/learnRounds/Hints";
import {Progress} from "@/components/ui/progress";
import {Check, ChevronLeft, SettingsIcon, X} from "lucide-react";
import {Link, useNavigate} from "react-router";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type {FunctionReturnType} from "convex/server";
import {Checkbox} from "@/components/ui/checkbox";
import LanguageSelector, {languages} from "@/components/LanguageSelector";

type Card = typeof cardSchema._type
type Component = ({ card, answer }: Props) => JSX.Element;

const rounds: Record<string, Component> = {
    show: Show,
    choose: Choose,
    hints: Hints,
    write: Write
}

const roundList = [
    {
        id: 'show',
        name: 'Cards',
    },
    {
        id: 'choose',
        name: 'Multiple choice'
    },
    {
        id: 'hints',
        name: 'Hints'
    },
    {
        id: 'write',
        name: 'Write'
    }
]

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

function Settings({ session }: { session: FunctionReturnType<typeof api.learnSessions.get> }) {
    const [open, setOpen] = useState(false);
    const updateSettings = useMutation(api.learnSessions.updateSettings)
    const form = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: session
    })

    async function submit(settings: typeof settingsSchema._type) {
        await updateSettings({
            ...settings,
            session: session._id
        })
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={"text-md"} variant={"ghost"}>
                    <SettingsIcon /> Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <div className={"space-y-8"}>
                            <FormField
                                control={form.control}
                                name={"answerIn"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Answer in</FormLabel>
                                        <FormControl>
                                            <LanguageSelector
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={[
                                                    { ...languages.find(ln => ln.value === session.languageA)!, value: 'a' },
                                                    { ...languages.find(ln => ln.value === session.languageB)!, value: 'b' }
                                                ]}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {session.type === 'learn' && (
                                <FormField
                                    control={form.control}
                                    name="enabledRoundTypes"
                                    render={({ field }) => (
                                        <FormItem className={"space-y-2"}>
                                            <FormLabel>Learn using</FormLabel>
                                            <FormControl>
                                                <div className={"grid grid-cols-2 gap-4"}>
                                                    {roundList.map(roundType => (
                                                        <div key={roundType.id} className={"flex gap-2"}>
                                                            <Checkbox
                                                                checked={field.value.includes(roundType.id)}
                                                                onCheckedChange={checked => {
                                                                    if (!checked) return field.onChange(field.value.filter(e => e !== roundType.id))

                                                                    const enabled = [...field.value, roundType.id]
                                                                    field.onChange(roundList.map(e => e.id).filter(e => enabled.includes(e)));
                                                                }}
                                                                id={roundType.id}
                                                            />
                                                            <Label htmlFor={roundType.id}>{roundType.name}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="flex items-center gap-2">
                                <Button type="submit">Update and restart</Button>
                                <DialogClose asChild>
                                    <Button type={"button"} variant={"secondary"}>Close</Button>
                                </DialogClose>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function Learn({ params }: Route.ComponentProps) {
    const navigate = useNavigate();
    const session = useQuery(api.learnSessions.get, { id: params.id })
    const next = useMutation(api.learnSessions.next)

    useEffect(() => {
        if (!session?.done) return

        navigate(`/learn/${session._id}/summary`)
    }, [session?.done])

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
                    <Link className={"flex"} to={`/lists/${session.list}`}>
                        <Button className={"text-md"} variant={"ghost"}>
                            <ChevronLeft /> Learning
                        </Button>
                    </Link>
                    <Separator orientation="vertical" />
                    <div className={"flex items-center flex-1 gap-4"}>
                        <Progress className={"h-5 flex-1"} value={done / session.allCards.length * 100} />
                        <div>{session.allCards.length - done} to go</div>
                        <div className={"flex gap-1.5 items-center"}>
                            <div className={"bg-green-500 aspect-square rounded-full p-0.5 text-white"}>
                                <Check size={20} />
                            </div>
                            {session.correct.length}
                        </div>
                        <div className={"flex gap-1.5 items-center"}>
                            <div className={"bg-red-500 aspect-square rounded-full p-0.5 text-white"}>
                                <X size={20} />
                            </div>
                            {session.incorrect.length}
                        </div>
                    </div>
                    <Separator orientation="vertical" />
                    <Settings session={session} />
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
