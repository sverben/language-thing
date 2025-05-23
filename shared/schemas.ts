import {z} from "zod";

export const cardSchema = z.object({
    wordA: z.string(),
    wordB: z.string(),
})

export const createListSchema = z.object({
    name: z.string().min(3),
    languageA: z.string(),
    languageB: z.string(),
    cards: z.array(cardSchema),
})

export const updateListSchema = createListSchema.extend({
    id: z.string(),
})

export const settingsSchema = z.object({
    enabledRoundTypes: z.array(z.string()),
    answerIn: z.enum(["a", "b"])
})

export const updateSettingsSchema = settingsSchema.extend({
    session: z.string(),
})

export const createLearnSchema = z.object({
    list: z.string(),
    type: z.enum(["learn", "test"])
})
