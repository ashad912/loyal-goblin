import axios from 'axios'
import { modifyUserStatusEmit} from '../../socket'


export const togglePresenceInInstance = (user, partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(user.inMission){
                console.log('enterInstance')
                const res = await axios.patch('/party/enterInstance')
                modifyUserStatusEmit(user, partyId)
                resolve(res.data)
            }else{
                console.log('leaveInstance')
                modifyUserStatusEmit(user, partyId)
                await axios.patch('/party/leaveInstance')
                resolve()
            }
        }catch (e) {
            reject(e)     
        } 
    })
          
}


export const toggleUserReady = async (user, partyId) => {
    return new Promise (async (resolve, reject) => {
        try{
            console.log('toggleUserReady ' + !user.readyStatus + " to " + user.readyStatus)
            if(user.readyStatus){
                await axios.patch('/party/ready')
            }else{
                await axios.patch('/party/notReady')
            }
            modifyUserStatusEmit(user, partyId)   
        }catch(e){

        }
    })
}