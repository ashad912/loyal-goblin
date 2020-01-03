import jwt from 'jsonwebtoken'
import cookie from "cookie";
import { User } from '../models/user'
import { Party } from '../models/party'

const decodeTokenAndGetUser = (token) => {
    return new Promise(async (resolve, reject) => {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) //finding proper user with proper token
            if(!user) {
                throw new Error()
            }
            resolve(user)
        }catch(e){
            reject(e)
        }
    })
    
}


export const auth = async (req, res, next) => {
    //console.log('auth middleware')
    try{
        
        const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''))

        if(!token){
            throw new Error()
        }
        
        const user = await decodeTokenAndGetUser(token)

        req.token = token //specified token - u can logout from specific device!
        req.user = user
        next()
        //console.log(token)
    }catch(e) {
        //console.log(e)
        res.status(401).send({ error: 'Please authenticate.'})
    }
}

const socketBasicAuth = (socket) => {
    return new Promise(async (resolve, reject) => {
        try{
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            const token = cookies.token

            if(!token){
                throw new Error()
            }
           
            const user = await decodeTokenAndGetUser(token)
        
            const party = await Party.findOne({
                $or: [
                    {leader: user._id},
                    {members: {$elemMatch: {$eq: user._id}}}
                ]
            })
        
            if(!party){
                throw new Error()
            }

            resolve(user)
        }catch(e){
            reject(e)
        }
    })

}


export const socketRoomAuth = (socket, partyId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await socketBasicAuth(socket)
            
            if(partyId.toString() !== user.party.toString()){
                throw Error('Invalid party!')
            }

            resolve()
        }catch(e){
            //console.log(e)
            reject(e)
        }
        
    })
}

export const socketConnectAuth = (socket) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await socketBasicAuth(socket)
            resolve(user)
        }catch(e){
            //console.log(e)
            reject(e)
        }
        
    })
}