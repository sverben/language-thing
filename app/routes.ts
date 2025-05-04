import {type RouteConfig, index, route, prefix} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("create", "routes/create.tsx"),
    route("learn/:id", "routes/learn.tsx"),

    ...prefix("lists/:id", [
        index("routes/lists/list.tsx"),
        route("edit", "routes/lists/edit.tsx"),
    ])
] satisfies RouteConfig;
