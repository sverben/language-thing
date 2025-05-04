import {type RouteConfig, index, route, prefix} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("create", "routes/create.tsx"),

    ...prefix("lists", [
        route(":id", "routes/lists/list.tsx"),
    ])
] satisfies RouteConfig;
