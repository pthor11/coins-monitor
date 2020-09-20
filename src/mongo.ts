import { connect, Db, MongoClient } from "mongodb";
import { mongoUri } from "./config";
import { AccountIndexes } from "./models/Account";

export let client: MongoClient
export let db: Db

export const collectionNames = {
    accounts: 'accounts'
}

export const connectDb = async () => {

    try {
        client = await connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            ignoreUndefined: true
        })

        client.on('error', async (e) => {
            try {
                await client.close()
                await connectDb()
            } catch (e) {
                setTimeout(connectDb, 1000)
                throw e
            }
        })

        client.on('timeout', async () => {
            try {
                await client.close()
                await connectDb()
            } catch (e) {
                setTimeout(connectDb, 1000)
                throw e
            }
        })

        client.on('close', async () => {
            try {
                await connectDb()
            } catch (e) {
                throw e
            }
        })

        db = client.db()

        await Promise.all([
            db.collection(collectionNames.accounts).createIndexes(AccountIndexes)
        ])

        console.log(`Mongodb: connected`)
    } catch (e) {
        console.error(`Mongodb: disconnected`)
        setTimeout(connectDb, 1000)
        throw e
    }
}