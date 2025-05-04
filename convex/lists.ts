import {query} from "./_generated/server";
import {ensureIdentity, zodMutation} from "./utils";
import {createListSchema} from "@shared/schemas";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ensureIdentity(ctx)

        return await ctx.db.query("lists")
            .filter((q) => q.eq(q.field('owner'), identity.subject))
            .collect()
    }
})

export const create = zodMutation({
    args: createListSchema,
    handler: async (ctx, args) => {
        const identity = await ensureIdentity(ctx)

        await ctx.db.insert("lists", {
            owner: identity.subject,
            name: args.name
        })
    }
})
