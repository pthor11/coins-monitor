import { IndexSpecification } from "mongodb"

export type Block = {
    resolved: boolean
    raw: object
    createdAt: Date
    updatedAt: Date
}

export const BlockIndexes: IndexSpecification[] = [
    { key: { "raw.height": 1 }, unique: true },
    { key: { resolved: 1 }, partialFilterExpression: { resolved: false } }
]