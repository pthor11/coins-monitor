import { config } from "dotenv";

config()

if (!process.env.PORT) throw new Error(`port for api must be provided`)
export const port = process.env.PORT

if (!process.env.MONGO) throw new Error(`mongo uri must be provided`)
export const mongoUri = process.env.MONGO

if (!process.env.BTC_BLOCKBOOK) throw new Error(`btc blockbook must be provided`)
export const btcBlockbook = process.env.BTC_BLOCKBOOK

export const blockbookMethods = {
    tx: 'tx',
    utxo: 'utxo',
    sendtx: 'sendtx',
    address: 'address',
    estimatefee: 'estimatefee',
}