import axios from 'axios'
import {partyRefreshEmit} from '../../socket'



export const getRankedUsers = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getRankedUsers')
            const res = await axios.get('/user/users')
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const updateAvatar = (avatar) => {
    return (dispatch) => {
        return new Promise( async (resolve, reject) => {
            
            try {
                console.log(avatar)
                
                let res
                if(avatar){
                    res = await axios.post('/user/me/avatar', avatar, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                      })
                }else{
                    res = await axios.delete('/user/me/avatar')
                }
                
                const profile = res.data
                delete profile._id

                dispatch( {type: "UPDATE_PROFILE_DATA", profile}) //DISPATCH IS SYNCHRONOUS!!!
            } catch (e) {
                console.log(e)
                dispatch( {type: "NO_CONNECTION", error: e})               
            }
            
            resolve()
            
        })
    }

}

export const shootShip = (fieldName) => {
    return (dispatch) => {
        return new Promise( async (resolve, reject) => {
            try {
                const res = await axios.patch('/user/loyal', {field: fieldName})
                const profile = res.data.updatedUser
                
                delete profile._id
                dispatch({type: 'UPDATE_PROFILE_DATA', profile})
                
                resolve(res.data.awardToPass)
            } catch (e) {
                console.log(e)
                dispatch( {type: "NO_CONNECTION", error: e})
                reject(e)     
            }
        })
    }
}


export const toggleItem = (id, category, equipped, memberId) => {
    return async dispatch => {
        try {
            
            if(memberId){
                const res = await axios.patch('/user/party/equip', {id, category, equipped, memberId})
                dispatch({type: "UPDATE_PARTY", party: res.data})
                partyRefreshEmit(res.data._id)
            }else{
                const res = await axios.patch('/user/myItems/equip', {id, category, equipped})
                const profile = res.data
                delete profile._id
                dispatch({type: 'UPDATE_PROFILE_DATA', profile})
            }

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const deleteItem = (id) => {
    return async dispatch => {
        try {
            const res = await axios.delete('/user/deleteUserItem', {data: {id}})
            const profile = res.data
            
            delete profile._id
            dispatch({type: 'UPDATE_PROFILE_DATA', profile})

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const clearRallyAwards = () => {
    return async dispatch => {
        try {
            console.log('clearUserAwards')
            const res = await axios.patch('/user/clearAwards')
            const profile = res.data
            
            delete profile._id
            dispatch({type: 'UPDATE_PROFILE_DATA', profile})
            
        }catch (e) {
            dispatch( {type: "NO_CONNECTION", error: e})      
        } 
    }
}

export const confirmLevel = (pointType) => {
    return async dispatch => {
        try {
            console.log('confirmLevel' + pointType)
            const res = await axios.patch('/user/confirmLevel', {pointType})
            const profile = res.data
            
            delete profile._id
            dispatch({type: 'UPDATE_PROFILE_DATA', profile})
            
        }catch (e) {
            dispatch( {type: "NO_CONNECTION", error: e})      
        } 
    }
}


export const getAllNames = () => {
    return async dispatch => {
        try {
           
            const res = await axios.get('/user/allNames')
            
            dispatch({type: 'GET_ALL_NAMES', names: res.data})
            
        }catch (e) {
            dispatch( {type: "NO_CONNECTION", error: e})      
        } 
    }
}

export const clearAllNames = () => {
    return {type: 'CLEAR_ALL_NAMES'}
}

export const createCharacter = (name, sex, characterClass, attributes) => {
    return async dispatch => {
        try {
           
            const res = await axios.patch('/user/character', {name, sex, characterClass, attributes})
            const profile = res.data
            
            delete profile._id
            dispatch({type: 'UPDATE_PROFILE_DATA', profile})
            
        }catch (e) {
            dispatch( {type: "NO_CONNECTION", error: e})      
        } 
    }
}