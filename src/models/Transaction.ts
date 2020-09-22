import { IndexSpecification } from "mongodb"

export type Transaction = {
    coin: string
    raw: object
    resolved: boolean
    createdAt: Date
    updatedAt: Date
}

export const TransactionIndexes: IndexSpecification[] = [
    { key: { "raw.txid": 1 }, unique: true },
    { key: { "raw.blockHeight": 1 } },
    { key: { coin: 1, resolved: 1 }, partialFilterExpression: { resolved: false } }
]