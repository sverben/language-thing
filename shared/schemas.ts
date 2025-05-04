import {z} from "zod";

export const cardSchema = z.object({
    wordA: z.string(),
    wordB: z.string(),
})

export const createListSchema = z.object({
    name: z.string().min(3),
    cards: z.array(cardSchema),
})
