import jwt from 'jsonwebtoken'
import { Barman } from '../models/barman'


const decodeTokenAndGetBarman = (token) => {
    return new Promise(async (resolve, reject) => {
        try{
            const decoded = jwt.verify(token, process.env.BARMAN_JWT_SECRET)
            const barman = await Barman.findOne({_id: decoded._id, token: token}) //finding proper user with proper token
            if(!barman) {
                throw new Error()
            }
            resolve(barman)
        }catch(e){
            reject(e)
        }
    })
    
}


export const barmanAuth = async (req, res, next) => {
    //console.log('auth middleware')
    try{
        
        const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''))

        if(!token){
            throw new Error()
        }
        
        const barman = await decodeTokenAndGetUser(token)

        req.token = token 
        req.barman = barman
        next()

    }catch(e) {

        res.status(401).send({ error: 'Please authenticate.'})
    }
}