import jwt from 'jsonwebtoken'
import cookie from "cookie";
import { User } from '../models/user'
import { Party } from '../models/party'

export const auth = async (req, res, next) => {
    //console.log('auth middleware')
    try{
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) //finding proper user with proper token
        if(!user) {
            throw new Error()
        }


        req.token = token //specified token - u can logout from specific device!
        req.user = user
        next()
        //console.log(token)
    }catch(e) {
        console.log(e)
        res.status(401).send({ error: 'Please authenticate.'})
    }
}


export const socketJoinAuth = (socket, partyId) => {
    return new Promise(async (resolve, reject) => {
        try{
            var cookies = cookie.parse(socket.handshake.headers.cookie);
            var token = cookies.token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id: decoded._id, party: partyId.toString(), 'tokens.token': token}) //finding proper user with proper token
            if(!user) {
                throw new Error()
            }

            const party = await Party.findOne({
                $or: [
                    {leader: user._id},
                    {members: {$elemMatch: user._id}}
                ]
            })

            if(!party){
                throw new Error()
            }
            
            resolve()
        }catch(e){
            //console.log(e)
            reject(e)
        }
        
    })
}