import { config } from "dotenv";

config()

export const port = process.env.PORT

export const mongoUri = process.env.MONGO

export const btcBlockbook = process.env.BTC_BLOCKBOOK

export const btcInitBlock = process.env.BTC_INIT_BLOCK

export const blockbookMethods = {
    tx: 'tx',
    utxo: 'utxo',
    block: 'block',
    sendtx: 'sendtx',
    address: 'address',
    estimatefee: 'estimatefee',
}