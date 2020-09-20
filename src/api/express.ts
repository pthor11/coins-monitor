import * as express from "express";
import { port } from "../config";
import { Coin } from "../models/Coin"
import { collectionNames, db } from "../mongo";

export const runApiServer = () => {
    try {
        const app = express()

        app.get('/add', async (req, res) => {
            try {
                const { address, coin } = req.query
                console.log({ address, coin })

                if (!Object.keys(Coin).includes(coin as string)) res.json({ error: `coin must be one of ${Object.keys(Coin).join(', ')}` })
                if (!address) res.json({ error: `address must be provided` })

                const { value } = await db.collection(collectionNames.accounts).findOneAndUpdate({
                    coin,
                    address,
                }, {
                    $setOnInsert: {
                        coin,
                        address,
                        createdAt: new Date()
                    },
                    $set: {
                        subscribed: true,
                        updatedAt: new Date()
                    }
                }, {
                    upsert: true,
                    returnOriginal: false
                })

                res.json({ _id: value._id.toString() })
            } catch (e) {
                throw e
            }
        })

        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    } catch (e) {
        throw e
    }
}