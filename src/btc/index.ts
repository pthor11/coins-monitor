import { connectDb } from "../mongo";
import { connectWs } from "./ws";

const start = async() => {
    try {
        await connectDb()
        
        connectWs()
    } catch (e) {
        throw e
    }
}

start()