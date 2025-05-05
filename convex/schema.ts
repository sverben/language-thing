import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

const card = v.object({
    wordA: v.string(),
    wordB: v.string(),
})

export default defineSchema({
    lists: defineTable({
        owner: v.string(),
        name: v.string(),
        languageA: v.string(),
        languageB: v.string(),
        cards: v.array(card)
    }),
    learnSessions: defineTable({
        list: v.id("lists"),
        owner: v.string(),

        languageA: v.string(),
        languageB: v.string(),

        correct: v.array(card),
        incorrect: v.array(card),
        done: v.boolean(),

        allCards: v.array(card),
        remaining: v.array(card),
        rounds: v.array(
            v.union(
                v.object({
                    kind: v.literal("item"),
                    round: v.number(),
                    repetition: v.boolean(),
                    card
                }),
                v.object({
                    kind: v.literal("queue")
                })
            )
        ),

        type: v.union(v.literal("learn"), v.literal("test")),
        enabledRoundTypes: v.array(v.string()),
        answerIn: v.union(v.literal("a"), v.literal("b")),
    })
})
