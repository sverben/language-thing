import { v } from "convex/values";
import {internalMutation, internalQuery, mutation, query} from "./_generated/server";
import {api, internal} from "./_generated/api";
import {ensureIdentity, shuffleArray} from "./utils";

const MAX_CURRENT = 6

export const getSession = internalQuery({
    args: {
        session: v.string()
    },
    async handler(ctx, args) {
        const identity = await ensureIdentity(ctx)

        const session = await ctx.db.query("learnSessions")
            .filter(q => q.and(q.eq(q.field("owner"), identity.subject), q.eq(q.field("_id"), args.session)))
            .first()
        if (!session) throw new Error("Session not found!")

        return session;
    }
})

export const queue = internalMutation({
    args: {
        session: v.id("learnSessions")
    },
    async handler(ctx, args) {
        const session = await ctx.runQuery(internal.learnSessions.getSession, args)
        if (session.rounds[0].kind === 'queue') {
            session.rounds.splice(0, 1)
        }
        for (let i = 0; i < 2; i++) {
            if (session.rounds.length >= MAX_CURRENT) continue

            const next = session.remaining.shift()
            if (!next) continue

            session.rounds.push({
                kind: "item",
                round: 0,
                card: next
            })
        }

        await ctx.db.patch(args.session, {
            rounds: session.rounds,
            remaining: session.remaining
        })
    }
})

export const create = mutation({
    args: {
        list: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ensureIdentity(ctx)

        const list = await ctx.db
            .query("lists")
            .filter((q) => q.and(q.eq(q.field("owner"), identity.subject), q.eq(q.field("_id"), args.list)))
            .first()
        if (!list) throw new Error("List not found")

        const session = await ctx.db.insert("learnSessions", {
            list: list._id,
            owner: identity.subject,

            allCards: list.cards,
            remaining: shuffleArray(list.cards),
            rounds: []
        })
        await ctx.runMutation(internal.learnSessions.queue, ({ session }))
    }
})

export const get = query({
    args: {
        session: v.string()
    },
    handler(ctx, args) {
       return ctx.runQuery(internal.learnSessions.getSession, args)
    }
})

export const next = mutation({
    args: {
        session: v.string(),
        correct: v.boolean()
    },
    async handler(ctx, args) {
        const identity = await ensureIdentity(ctx)

    }
})
