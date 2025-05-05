import {v} from "convex/values";
import {internalMutation, mutation, query} from "./_generated/server";
import {internal} from "./_generated/api";
import {ensureIdentity, shuffleArray, zodMutation} from "./utils";
import type {GenericMutationCtx} from "convex/server";
import type {DataModel} from "./_generated/dataModel";
import {updateSettingsSchema} from "@shared/schemas";

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

            if (session.answerIn === 'a') {
                const previousA = next.wordA
                next.wordA = next.wordB
                next.wordB = previousA
            }

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
        return true
    }
})

export const checkEnded = internalMutation({
    args: {
        session: v.id("learnSessions")
    },
    async handler(ctx, args) {
        const session = await getSession(ctx, args.session)
        if (session.rounds.find(e => e.kind === 'item')) return false

        await ctx.db.delete(session._id)
        return true
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

        const existingSession = await ctx.db.query("learnSessions")
            .filter(q => q.and(q.eq(q.field("owner"), identity.subject), q.eq(q.field("list"), list._id)))
            .first()
        if (existingSession) await ctx.db.delete(existingSession._id)

        const session = await ctx.db.insert("learnSessions", {
            list: list._id,
            owner: identity.subject,

            languageA: list.languageA,
            languageB: list.languageB,

            allCards: list.cards,
            remaining: shuffleArray(list.cards),
            rounds: [],

            enabledRoundTypes: ['show', 'choose', 'hints', 'write'],
            answerIn: 'b'
        })
        await ctx.runMutation(internal.learnSessions.queue, ({ session }))

        return session
    }
})

export const updateSettings = zodMutation({
    args: updateSettingsSchema,
    async handler(ctx, args) {
        const session = await getSession(ctx, args.session)

        await ctx.db.patch(session._id, {
            remaining: shuffleArray(session.allCards),
            rounds: [],

            enabledRoundTypes: args.enabledRoundTypes,
            answerIn: args.answerIn
        })
        await ctx.runMutation(internal.learnSessions.queue, ({ session: session._id }))
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
    async handler(ctx, args): Promise<boolean> {
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

        return await ctx.runMutation(internal.learnSessions.checkEnded, {
            session: session._id
        })
    }
})

export const getForList = query({
    args: {
        list: v.string()
    },
    async handler(ctx, args) {
        const identity = await ensureIdentity(ctx)

        return await ctx.db.query('learnSessions')
            .filter(q => q.and(q.eq(q.field("list"), args.list), q.eq(q.field("owner"), identity.subject)))
            .first()
    }
})
