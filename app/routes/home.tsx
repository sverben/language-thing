import type { Route } from "./+types/home";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const tests = useQuery(api.tests.get)
  return (
      <div>
        {tests?.map(test => (
            <div>{test.name}</div>
        ))}
      </div>
  );
}
