import {query} from "./_generated/server";
import {ensureIdentity, zodMutation} from "./utils";
import {createListSchema, updateListSchema} from "@shared/schemas";
import {v} from "convex/values";

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ensureIdentity(ctx)

        return await ctx.db.query("lists")
            .filter((q) => q.eq(q.field('owner'), identity.subject))
            .collect()
    }
})

export const get = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ensureIdentity(ctx)

        return await ctx.db
            .query("lists")
            .filter((q) => q.and(q.eq(q.field("owner"), identity.subject), q.eq(q.field("_id"), args.id)))
            .first()
    }
})

export const create = zodMutation({
    args: createListSchema,
    handler: async (ctx, args) => {
        const identity = await ensureIdentity(ctx)

        await ctx.db.insert("lists", {
            owner: identity.subject,
            name: args.name,
            cards: args.cards.filter(card => card.wordA || card.wordB),
            languageA: args.languageA,
            languageB: args.languageB
        })
    }
})

export const update = zodMutation({
    args: updateListSchema,
    handler: async (ctx, args) => {
        const identity = await ensureIdentity(ctx)

        const list = await ctx.db.query("lists")
            .filter(q => q.and(q.eq(q.field("_id"), args.id), q.eq(q.field("owner"), identity.subject)))
            .first()
        if (!list) throw new Error("List not found")

        await ctx.db.patch(list._id, {
            owner: identity.subject,
            name: args.name,
            cards: args.cards.filter(card => card.wordA || card.wordB),
            languageA: args.languageA,
            languageB: args.languageB
        })
    }
})
