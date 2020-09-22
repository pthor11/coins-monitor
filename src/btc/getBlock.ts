import { blockbookMethods } from "../config"
import { callBlockbook } from "../libs/blockbook"
import { Coin } from "../models/Coin"
import { client, collectionNames, connectDb, db } from "../mongo"

const downloadBlock = async (height: number, page: number = 1, txs: any[] = []): Promise<any> => {
    try {
        const result = await callBlockbook({ method: blockbookMethods.block, data: `/${height}?page=${page}` })

        if (result.page < result.totalPages) {
            return downloadBlock(height, page + 1, [...result.txs, ...txs])
        } else {
            return { ...result, txs: [...result.txs, ...txs] }
        }
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const getBlock = async (height: number) => {
    const session = client.startSession()
    session.startTransaction()

    try {
        const block = await downloadBlock(height)

        await db.collection(collectionNames.txs).insertMany(block.transactions.map(transaction => {
            return {
                coin: Coin.btc,
                raw: transaction,
                resolved: false,
                createdAt: new Date()
            }
        }), { session })

        await session.commitTransaction()
        session.endSession()
    } catch (e) {
        await session.abortTransaction()
        session.endSession()
        throw e
    }
}