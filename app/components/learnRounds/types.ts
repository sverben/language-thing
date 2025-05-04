import type {cardSchema} from "@shared/schemas";

export type Card = typeof cardSchema._type
export type Props = { cards: Card[], card: Card, answer: (correct: boolean) => void }
