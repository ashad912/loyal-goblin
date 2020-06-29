import jwt from 'jsonwebtoken'
import {getEndpointError} from '@utils/functions'
import {ERROR, INFO, WARN} from '@utils/constants'

export const getToken = (req, field) => {
    const token = req.cookies[field] || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''))

    if(!token){
        throw getEndpointError(INFO, 'No auth - no token')
    }

    return token
}

export const decodeTokenAndGet = (Query, params, token, secret) => {
    return new Promise(async (resolve, reject) => {
        try{
            
            const decoded = jwt.verify(token, secret)
            const query = Object.assign(params, {_id: decoded._id})
            const doc = await Query.findOne(query) //finding proper user with proper token
            if(!doc) {
                throw getEndpointError(WARN, 'No auth - invalid token')
            }

            resolve(doc)
        }catch(e){
            if(e.name === 'JsonWebTokenError'){
                e = getEndpointError(WARN, e.message)
            }
            
            reject(e)
        }
    })
    
}