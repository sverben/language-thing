import type {Route} from "./+types/summary";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import WordCard from "@/components/WordCard";
import {useEffect, useMemo, useState} from "react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Link, useNavigate} from "react-router";
import {Separator} from "@/components/ui/separator";
import {Check, Edit, Pen, Pencil, Play, RefreshCw, X} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {LanguageRender, languages} from "@/components/LanguageSelector";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import type {createLearnSchema} from "@shared/schemas";
import LearnButton from "@/components/LearnButton";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Summary({ params }: Route.ComponentProps) {
    const session = useQuery(api.learnSessions.get, { id: params.id })

    if (!session) return

    return (
        <div className={"flex flex-col gap-8"}>
            <div className={"flex flex-col gap-4"}>
                <div className={"flex items-center justify-between"}>
                    <h1 className={'text-2xl font-bold'}>Summary</h1>
                    <LearnButton label={"Practice again"} list={session.list} />
                </div>
                <div className="flex gap-2">
                    <Card className={"flex-1"}>
                        <CardHeader className={"gap-4"}>
                            <CardDescription>Grade</CardDescription>
                            <CardTitle>{Math.round((9 / session.allCards.length * session.correct.length + 1) * 10) / 10}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className={"flex-1"}>
                        <CardHeader className={"gap-4"}>
                            <CardDescription>Correct/incorrect</CardDescription>
                            <CardTitle className={"flex gap-4"}>
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
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {
                [
                    {
                        Icon: () => (
                            <div className={"bg-red-500 aspect-square rounded-full p-0.5 text-white"}>
                                <X />
                            </div>
                        ),
                        label: "Incorrect",
                        cards: session.incorrect
                    },
                    {
                        Icon: () => (
                            <div className={"bg-green-500 aspect-square rounded-full p-0.5 text-white"}>
                                <Check size={20} />
                            </div>
                        ),
                        label: "Correct",
                        cards: session.correct
                    },
                ].map(({ Icon, label, cards }) => cards.length > 0 && (
                    <div className={"flex flex-col gap-4"}>
                        <h2 className={"flex items-center gap-2 font-bold text-xl"}><Icon /> {label}</h2>

                        <Card className={"gap-0"}>
                            <CardHeader>
                                <div className="flex mb-4">
                                    <div className="flex-1 font-bold">
                                        <LanguageRender code={session.languageA} />
                                    </div>
                                    <div className="flex-1 font-bold">
                                        <LanguageRender code={session.languageB} />
                                    </div>
                                </div>
                                <div className={"-mx-6"}>
                                    <Separator />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {cards.map((card, index) => (
                                    <div key={index}>
                                        <div className={"flex"}>
                                            <div className={"flex-1 py-4"}>{card.wordA}</div>
                                            <div className={"flex-1 p-4"}>{card.wordB}</div>
                                        </div>
                                        {cards.length - 1 !== index && (
                                            <div className={"-mx-6"}>
                                                <Separator />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                ))
            }
        </div>
    );
}
