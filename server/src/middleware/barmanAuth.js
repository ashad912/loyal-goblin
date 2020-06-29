import { Barman } from '@models/barman'
import {getToken, decodeTokenAndGet} from './functions'



export const barmanAuth = async (req, res, next) => {
    try{
        
        const token = getToken(req, 'tokash')
        const barman = await decodeTokenAndGet(Barman, {token}, token, process.env.BARMAN_JWT_SECRET)

        req.token = token 
        req.barman = barman
        next()

    }catch(e) {
        e.status = 401
        next(e)
    }
}