import { mongoUri, btcBlockbook, btcInitBlock } from "../config";
import { fork } from 'child_process';
import { join } from "path";


const checkEnv = () => {
    if (!mongoUri) throw new Error(`mongo uri must be provided`)
    if (!btcBlockbook) throw new Error(`btc blockbook must be provided`)
    if (!parseInt(btcInitBlock || '')) throw new Error(`btc init block must be provided`)
}

const start = async () => {
    try {
        checkEnv()

        const syncBlocks = fork(join(__dirname, `syncBlocks`), [], {
            execArgv: ['-r', 'ts-node/register'],
        })

        syncBlocks.on('error', e => { throw e })

        const syncTransactions = fork(join(__dirname, `syncTransactions`), [], {
            execArgv: ['-r', 'ts-node/register'],
        })

        syncTransactions.on('error', e => { throw e })

        // await connectDb()

        // await getBlock()

        // await resolvingTransactions()
    } catch (e) {
        throw e
    }
}

start()