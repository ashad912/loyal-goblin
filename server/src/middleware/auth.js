import jwt from 'jsonwebtoken'
import moment from 'moment'
import cookie from "cookie";
import { User } from '../models/user'
import { Party } from '../models/party'

const decodeTokenAndGetUser = (token, query) => {
    return new Promise(async (resolve, reject) => {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id: decoded._id, 'tokens.token': token, active: true}) //finding proper user with proper token
            if(!user) {
                throw new Error()
            }
            
            const autoFetch = query && query.autoFetch && ((new Date().getTime() % 3600000) < 5000) //verify autoFetch query (available to 5 seconds after start of hour)
            
            if(!autoFetch){
                let sub
                if(user.lastActivityDate){
                    sub = moment().valueOf() - moment(user.lastActivityDate).valueOf()
                }
                if(!user.lastActivityDate || (sub && sub >= 60 * 1000)){ //1 min db field refresh
                    user.lastActivityDate = moment().toISOString()
                    await user.save()
                }
            }
            
            

            resolve(user)
        }catch(e){
            console.log(e)
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
        
        const user = await decodeTokenAndGetUser(token, req.query)

        req.token = token //specified token - u can logout from specific device!
        req.user = user
        next()
        //console.log(token)
    }catch(e) {
        console.log(e.message)
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
            console.log(e)
            reject(e)
        }
        
    })
}