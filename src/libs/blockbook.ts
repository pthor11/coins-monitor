import axios from 'axios'
import * as https from 'https'
import { btcBlockbook, blockbookMethods } from '../config'

export const callBlockbook = async ({ method, data, params = {} }: { method: string, data: string, params?: object }) => {
    try {
        if (method === blockbookMethods.sendtx) {
            const result = await axios({
                url: `${btcBlockbook!}/${method}/`,
                data,
                method: 'post',
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            })
            return result.data
        } else {
            const result = await axios({
                url: `${btcBlockbook!}/${method}/${data}`,
                params,
                method: 'get',
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            })
            return result.data
        }
    } catch (e) {
        console.error(e)
        throw e
    }
}