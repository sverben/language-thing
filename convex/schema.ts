import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    lists: defineTable({
        owner: v.string(),
        name: v.string(),
        cards: v.array(
            v.object({
                wordA: v.string(),
                wordB: v.string(),
            })
        )
    }),
})
