import {type RouteConfig, index, route, prefix} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("create", "routes/create.tsx"),

    ...prefix("lists/:id", [
        index("routes/lists/list.tsx"),
        route("learn", "routes/lists/learn.tsx")
    ])
] satisfies RouteConfig;
