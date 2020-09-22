import { IndexSpecification } from "mongodb"

export type Block = {
    coin: string
    height: number
    updatedAt: Date
}

export const BlockIndexes: IndexSpecification[] = [
    { key: { coin: 1 }, unique: true }
]