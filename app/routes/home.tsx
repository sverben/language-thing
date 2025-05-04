import type {Route} from "./+types/home";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Link} from "react-router";

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
                <CardHeader>
                  <CardTitle>{list.name}</CardTitle>
                  <CardDescription>{list.cards.length} words</CardDescription>
                </CardHeader>
              </Card>
            </Link>
        ))}
      </div>
  );
}
