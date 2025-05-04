import type {Route} from "./+types/home";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const lists = useQuery(api.lists.get)

  return (
      <div>
        {lists?.map(list => (
            <div>{list.name}</div>
        ))}
      </div>
  );
}
