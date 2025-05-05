import {type RouteConfig, index, route, prefix, layout} from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        index("routes/home.tsx"),
        route("create", "routes/create.tsx"),

        ...prefix("lists/:id", [
            index("routes/lists/list.tsx"),
            route("edit", "routes/lists/edit.tsx"),
        ])
    ]),

    ...prefix("learn/:id", [
        index("routes/learn/learn.tsx"),
        layout("routes/layout.tsx", { id: "learn/layout" }, [
            route("summary", "routes/learn/summary.tsx")
        ])
    ])
] satisfies RouteConfig;
