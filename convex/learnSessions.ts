import {v} from "convex/values";
import {internalMutation, mutation, query} from "./_generated/server";
import {internal} from "./_generated/api";
import {ensureIdentity, shuffleArray} from "./utils";
import type {GenericMutationCtx} from "convex/server";
import type {DataModel} from "./_generated/dataModel";

const MAX_CURRENT = 6

type CTX = GenericMutationCtx<DataModel>
async function getSession(ctx: CTX, session: string) {
    const identity = await ensureIdentity(ctx)

    const current = await ctx.db.query("learnSessions")
        .filter(q => q.and(q.eq(q.field("owner"), identity.subject), q.eq(q.field("_id"), session)))
        .first()
    if (!current) throw new Error("Session not found!")

    return current;
}

export const queue = internalMutation({
    args: {
        session: v.id("learnSessions")
    },
    async handler(ctx, args) {
        const session = await getSession(ctx, args.session)
        if (session.rounds[0]?.kind === 'queue') {
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

        session.rounds.push({
            kind: "queue"
        })
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
            rounds: [],
            enabledRoundTypes: ['show', 'choose', 'hints', 'write']
        })
        await ctx.runMutation(internal.learnSessions.queue, ({ session }))

        return session
    }
})

export const get = query({
    args: {
        id: v.string()
    },
    handler(ctx, args) {
        return getSession(ctx as CTX, args.id)
    }
})

export const next = mutation({
    args: {
        session: v.string(),
        correct: v.boolean()
    },
    async handler(ctx, args) {
        const session = await getSession(ctx, args.session)

        const round = session.rounds.shift()
        if (!round) throw new Error('No round found')
        if (round.kind !== 'item') throw new Error('Round uses invalid type')

        if (!args.correct) {
            session.rounds.push(round)
        } else if (round.round < session.enabledRoundTypes.length - 1) {
            session.rounds.push({
                ...round,
                round: round.round + 1
            })
        }

        await ctx.db.patch(session._id, {
            rounds: session.rounds
        })
        if (session.rounds[0].kind === 'queue') {
            await ctx.runMutation(internal.learnSessions.queue, {
                session: session._id
            })
        }
    }
})
