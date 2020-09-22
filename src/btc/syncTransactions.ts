import { Coin } from "../models/Coin"
import { collectionNames, connectDb, db } from "../mongo"

const resolvingTransactions = async () => {
    try {
        const transactions = await db.collection(collectionNames.txs).find({
            coin: Coin.btc,
            resolved: false
        }).sort({ "raw.blockHeight": 1 }).limit(100).toArray()

        if (transactions.length > 0) {
            for (const transaction of transactions) {
                await db.collection(collectionNames.txs).updateOne({ "raw.txid": transaction.raw.txid }, { $set: { resolved: true, updatedAt: new Date() } })
            }

            console.log({ transactions: transactions.length })

        } 

        setTimeout(resolvingTransactions, 1000)
    } catch (e) {
        setTimeout(resolvingTransactions, 1000)
        throw e
    }
}

const syncTransactions = async() => {
    try {
        await connectDb()
        
        await resolvingTransactions()
    } catch (e) {
        throw e
    }
}

syncTransactions()