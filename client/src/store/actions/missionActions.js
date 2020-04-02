import axios from 'axios'
import { modifyUserStatusEmit, instanceRefreshEmit, addItemEmit, deleteItemEmit, finishMissionEmit} from '../../socket'

const axiosInstance = axios.create({}); //to avoid interceptors "index.js"


export const setActiveInstance = (id, imgSrc) => {
    return (dispatch) => {
        console.log('haloo')
        dispatch( {type: "SET_INSTANCE", id, imgSrc})
    }
}


export const getMissionList = () => {
    return dispatch => {
        return new Promise (async (resolve, reject) => {
            try {
                
                const res = await axios.get('/mission/list')
                //console.log(res.data)

                const missionObject = res.data
        
                //setMissionListData(missionObject.missions)
                dispatch({type: "UPDATE_MISSIONS", missions: missionObject.missions})

                if(missionObject.missionInstanceId){
                    const instanceIndex = missionObject.missions.findIndex((mission) => mission._id === missionObject.missionInstanceId)
                    //dispatch( {type: "SET_INSTANCE", id: missionObject.missionInstanceId, imgSrc: missionObject.missions[instanceIndex].imgSrc})
                    dispatch(setActiveInstance(missionObject.missionInstanceId, missionObject.missions[instanceIndex].imgSrc))
                }else{
                    //dispatch( {type: "SET_INSTANCE", id: missionObject.missionInstanceId, imgSrc: missionObject.missions[instanceIndex].imgSrc})
                    dispatch(setActiveInstance(null, null))
                }


                //??
                resolve(res.data)

            }catch (e) {
                reject(e)     
            } 
        })
    }
    
}

export const createInstance = (missionId, partyId) => {
    return (dispatch) => {
        return new Promise (async (resolve, reject) => {
            try {
                const res = await axios.post('/mission/createInstance', {_id: missionId})
                const missionInstance = res.data.missionInstance
                const imgSrc = res.data.imgSrc


                dispatch(setActiveInstance(missionInstance, imgSrc))
                instanceRefreshEmit(partyId)
                resolve(missionInstance)
            }catch (e) {
                reject(e)     
            } 
        })
    }
}

export const deleteInstance = (partyId) => {
    return (dispatch) => {
        return new Promise (async (resolve, reject) => {
            try {
                await axios.delete('/mission/deleteInstance')
    
                dispatch(setActiveInstance(null, null))
                instanceRefreshEmit(partyId)
                resolve()
            }catch (e) {
                reject(e)     
            } 
        })
    }
    
}

export const finishInstance = (partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await axios.delete('/mission/finishInstance')
            
            finishMissionEmit(res.data, partyId)
            //instanceRefreshEmit(partyId)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}


export const sendItemToMission = (item, partyId) => {
    return new Promise (async (resolve, reject) => {
        try {
            await axiosInstance.patch('/mission/sendItem/mission', {item: item._id})
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
            await axiosInstance.patch('/mission/sendItem/user', {item: id})
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
                
                const res = await axiosInstance.patch('/mission/enterInstance')
                if(socketStatusConnection !== undefined){
                    if(res.data.missionInstance.party.length > 1 && !socketStatusConnection){ //if client of multiplayer mission is not connected to socket
                        reject()
                    }
                }
                modifyUserStatusEmit(user, partyId)
                resolve(res.data)
            }else{
                
                modifyUserStatusEmit(user, partyId)
                await axiosInstance.patch('/mission/leaveInstance')
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
            //console.log('toggleUserReady ' + !user.readyStatus + " to " + user.readyStatus)
            if(user.readyStatus){
                await axiosInstance.patch('/mission/ready')
            }else{
                await axiosInstance.patch('/mission/notReady')
            }
            modifyUserStatusEmit(user, partyId)
            resolve()
        }catch(e){
            reject(e) 
        }
    })
}