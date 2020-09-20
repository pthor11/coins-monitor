import { connectDb } from "../mongo";
import { runApiServer } from "./express";

const start = async () => {
    try {
        await connectDb()

        runApiServer()

    } catch (e) {
        throw e
    }
}

start ()