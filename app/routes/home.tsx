import type {Route} from "./+types/home";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Link} from "react-router";
import {getLanguageIcon} from "@/components/LanguageSelector";
import {ArrowLeftRight} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const lists = useQuery(api.lists.getAll)

  return (
      <div className={"flex flex-col gap-4"}>
        {lists?.map(list => (
            <Link to={`/lists/${list._id}`} key={list._id}>
              <Card>
                <CardHeader className={"flex gap-4 items-center"}>
                  <div className={"flex gap-2 items-center"}>
                    <img className={"aspect-square rounded-full h-8 object-cover"} src={getLanguageIcon(list.languageB)} alt="" />
                  </div>
                  <div className={"flex flex-col gap-2"}>
                    <CardTitle>{list.name}</CardTitle>
                    <CardDescription>{list.cards.length} words</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
        ))}
      </div>
  );
}
