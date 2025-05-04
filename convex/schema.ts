import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    tests: defineTable({
        name: v.string(),
    }),
    lists: defineTable({
        test: v.id("tests"),
        name: v.string()
    })
})
