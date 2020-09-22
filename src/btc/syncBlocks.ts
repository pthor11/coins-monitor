import { blockbookMethods, btcInitBlock } from "../config"
import { callBlockbook } from "../libs/blockbook"
import { Block } from "../models/Block"
import { Coin } from "../models/Coin"
import { client, collectionNames, connectDb, db } from "../mongo"

const downloadBlock = async (height: number, page: number = 1, txs: any[] = []): Promise<any> => {
    try {
        const result = await callBlockbook({ method: blockbookMethods.block, data: `/block/${height}?page=${page}` })

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

const getBlock = async () => {
    const session = client.startSession()
    session.startTransaction()

    try {
        const block = await db.collection(collectionNames.blocks).findOne({ coin: Coin.btc }, { session }) as Block | undefined

        const height = block?.height ? block.height + 1 : parseInt(btcInitBlock || '')

        const downloadedBlock = await downloadBlock(height)

        await db.collection(collectionNames.blocks).updateOne({ coin: Coin.btc }, {
            $set: {
                height,
                updatedAt: new Date()
            }
        }, {
            upsert: true,
            session
        })

        await db.collection(collectionNames.txs).insertMany(downloadedBlock.txs.map(transaction => {
            return {
                coin: Coin.btc,
                raw: transaction,
                resolved: false,
                createdAt: new Date()
            }
        }), { session })

        await session.commitTransaction()
        session.endSession()

        console.log({ height })

        setTimeout(getBlock, 10000)
    } catch (e) {
        await session.abortTransaction()
        session.endSession()

        setTimeout(getBlock, 10000)
        if (e.response?.status !== 400) throw e
    }
}

const syncBlock = async () => {
    try {
        await connectDb()

        await getBlock()
    } catch (e) {
        throw e
    }
}

syncBlock()