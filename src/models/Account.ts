import { IndexSpecification } from "mongodb"

export type Account = {
    coin: string
    address: string
    subscribed: boolean
    createdAt: Date
    updatedAt: Date
}

export const AccountIndexes: IndexSpecification[] = [
    { key: { currency: 1 } },
    { key: { coin: 1, address: 1, subscribed: 1 }, partialFilterExpression: { subscribed: true } },
    { key: { coin: 1, address: 1 }, unique: true }
]