import cookie from "cookie";
import { User } from '@models/user'
import { Party } from '@models/party'

import {decodeTokenAndGet} from './functions'

const socketBasicAuth = (socket) => {
    return new Promise(async (resolve, reject) => {
        try{
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            const token = cookies.token

            if(!token){
                throw new Error()
            }
           
            const user = await decodeTokenAndGet(User, {active: true, 'tokens.token': token}, token, process.env.JWT_SECRET)
        
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