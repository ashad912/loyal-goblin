import axios from 'axios'
import { modifyUserStatusEmit, instanceRefreshEmit, addItemEmit, deleteItemEmit, finishMissionEmit} from '../../socket'

export const setActiveInstanceId = (id) => {
    return (dispatch) => {
        dispatch( {type: "SET_INSTANCE_ID", id})
    }
}


export const getMissionList = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getMissionList')
            const res = await axios.get('/mission/list')
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const createInstance = (missionId, partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await axios.post('/mission/createInstance', {_id: missionId})
            instanceRefreshEmit(partyId)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const deleteInstance = (partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            await axios.delete('/mission/deleteInstance')
            instanceRefreshEmit(partyId)
            resolve()
        }catch (e) {
            reject(e)     
        } 
    })
}

export const finishInstance = (partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await axios.delete('/mission/finishInstance')
            console.log(res.data)
            finishMissionEmit(res.data, partyId)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}


export const sendItemToMission = (item, partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            await axios.patch('/mission/sendItem/mission', {item: item._id})
            addItemEmit(item, partyId)
            resolve()
        }catch (e) {
            reject(e)     
        } 
    })
}

export const sendItemToUser = (id, partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            await axios.patch('/mission/sendItem/user', {item: id})
            deleteItemEmit(id, partyId)
            resolve()
        }catch (e) {
            reject(e)     
        } 
    })
}

export const togglePresenceInInstance = (user, partyId, socketStatusConnection) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(user.inMission){
                console.log('enterInstance')
                const res = await axios.patch('/mission/enterInstance')
                if(socketStatusConnection !== undefined){
                    if(res.data.missionInstance.party.length > 1 && !socketStatusConnection){ //if client of multiplayer mission is not connected to socket
                        reject()
                    }
                }
                modifyUserStatusEmit(user, partyId)
                resolve(res.data)
            }else{
                console.log('leaveInstance')
                modifyUserStatusEmit(user, partyId)
                await axios.patch('/mission/leaveInstance')
                resolve()
            }
        }catch (e) {
            console.log(e)
            reject(e)     
        } 
    })
          
}


export const toggleUserReady = async (user, partyId) => {
    return new Promise (async (resolve, reject) => {
        try{
            console.log('toggleUserReady ' + !user.readyStatus + " to " + user.readyStatus)
            if(user.readyStatus){
                await axios.patch('/mission/ready')
            }else{
                await axios.patch('/mission/notReady')
            }
            modifyUserStatusEmit(user, partyId)
            resolve()
        }catch(e){
            reject(e) 
        }
    })
}