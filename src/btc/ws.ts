import * as WebSocket from "ws"
import { cache } from "./cache";
import { getBlock } from "./getBlock";

export const connectWs = () => {
    const ws = new WebSocket(`wss://tbtc1.trezor.io/websocket`)

    ws.on('open', () => {
        console.log('open');

        const ping = setInterval(() => {
            if (ws?.readyState === ws.OPEN) {
                ws.ping()
            } else {
                clearInterval(ping)
            }
        }, 10000)

        ws.send(JSON.stringify({ method: "subscribeNewBlock" }), e => { if (e) throw e })

    })

    ws.on('message', async msg => {
        const data = JSON.parse(msg.toString())
        console.log({ data });

        if (data.data?.height) {
            cache.currentBlock = data.data.height
            await getBlock(data.data.height)
        }
    })

    ws.on('close', code => {
        console.log(`ws closed code ${code}`)

        setTimeout(connectWs, 1000)
    })

    ws.on('error', e => {
        console.error(e)
        ws.close(1006)
    })
}