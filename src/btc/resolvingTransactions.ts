import { Coin } from "../models/Coin"
import { collectionNames, db } from "../mongo"

export const resolvingTransactions = async () => {
    try {
        const transactions = await db.collection(collectionNames.txs).find({
            coin: Coin.btc,
            resolved: false
        }).sort({ "raw.blockHeight": 1 }).limit(100).toArray()

        if (transactions.length > 0) {
            for (const transaction of transactions) {
                await db.collection(collectionNames.txs).updateOne({ "raw.txid": transaction.txid }, { $set: { resolved: true, updatedAt: new Date() } })
            }
        } else {
            setTimeout(resolvingTransactions, 1000)
        }
    } catch (e) {
        setTimeout(resolvingTransactions, 1000)
        throw e
    }
}