import { mongoUri, btcBlockbook } from "../config";
import { connectDb } from "../mongo";
import { connectWs } from "./ws";

const checkEnv = () => {
    if (!mongoUri) throw new Error(`mongo uri must be provided`)
    if (!btcBlockbook) throw new Error(`btc blockbook must be provided`)
}

const start = async() => {
    try {
        checkEnv()
        
        await connectDb()
        
        connectWs()
    } catch (e) {
        throw e
    }
}

start()