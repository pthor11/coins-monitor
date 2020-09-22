import { mongoUri, port } from "../config";
import { connectDb } from "../mongo";
import { runApiServer } from "./express";

const checkEnv = () => {
    if (!mongoUri) throw new Error(`mongo uri must be provided`)
    if (!port) throw new Error(`btc blockbook must be provided`)
}

const start = async () => {
    try {
        checkEnv()
        
        await connectDb()

        runApiServer()

    } catch (e) {
        throw e
    }
}

start ()