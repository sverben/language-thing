import type {Route} from "./+types/list";
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
import {Edit, Pen, Pencil, Play, RefreshCw} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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

function shuffleArray<Type>(array: Type[]): Type[] {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

export default function List({ params }: Route.ComponentProps) {
    const list = useQuery(api.lists.get, { id: params.id })
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState<number>(0)
    const [shuffle, setShuffle] = useState(false)
    const session = useQuery(api.learnSessions.getForList, { list: params.id })

    useEffect(() => {
        if (!carouselApi) return

        setCurrent(carouselApi.selectedScrollSnap())
        carouselApi.on("select", () => {
            setCurrent(carouselApi.selectedScrollSnap())
        })
    }, [carouselApi]);

    const cards = useMemo(() => shuffle ? shuffleArray(list?.cards || []) : list?.cards || [], [list?.cards, shuffle])

    if (!list) return

    return (
        <div className={"flex flex-col gap-4"}>
            <div className={"flex justify-between items-center"}>
                <div>
                    <h1 className={"text-2xl font-bold"}>{list.name}</h1>
                    <p className={"text-neutral-600"}>{list.cards.length} words</p>
                </div>
                <div className={"flex gap-2"}>
                    <Link to={"edit"}>
                        <Button><Pen /></Button>
                    </Link>

                   <LearnButton list={list._id} />

                    {session && (
                        <Link to={`/learn/${session._id}`}>
                            <Button variant={"secondary"}><RefreshCw /> Continue {session.type}</Button>
                        </Link>
                    )}
                </div>
            </div>

            <Separator />

            <div className={"flex flex-col gap-4"}>
                <h2 className={"font-bold text-xl"}>Cards</h2>

                <div className={"flex gap-2"}>
                    <Switch checked={shuffle} onCheckedChange={setShuffle} id={"shuffle"} />
                    <Label htmlFor={"shuffle"}>Shuffle cards</Label>
                </div>

                <Carousel setApi={setCarouselApi} className="w-auto mx-12">
                    <CarouselContent>
                        {cards.map((card, index) => (
                            <CarouselItem key={index}>
                                <WordCard active={current === index} card={card} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            <div className={"flex flex-col gap-4"}>
                <h2 className={"font-bold text-xl"}>Words</h2>

                <Card className={"gap-0"}>
                    <CardHeader>
                        <div className="flex mb-4">
                            <div className="flex-1 font-bold">
                                <LanguageRender code={list.languageA} />
                            </div>
                            <div className="flex-1 font-bold">
                                <LanguageRender code={list.languageB} />
                            </div>
                        </div>
                        <div className={"-mx-6"}>
                            <Separator />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {list.cards.map((card, index) => (
                            <div key={index}>
                                <div className={"flex"}>
                                    <div className={"flex-1 py-4"}>{card.wordA}</div>
                                    <div className={"flex-1 p-4"}>{card.wordB}</div>
                                </div>
                                {list.cards.length - 1 !== index && (
                                    <div className={"-mx-6"}>
                                        <Separator />
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
