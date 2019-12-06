import axios from 'axios'

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
                profile.avatar = profile.avatar ? ('data:image/png;base64,' + profile.avatar) : (undefined)
                const uid = profile._id
                delete profile._id  
                dispatch( {type: "UPDATE_PROFILE_DATA'", profile}) //DISPATCH IS SYNCHRONOUS!!!
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
            profile.avatar = profile.avatar ? ('data:image/png;base64,' + profile.avatar) : (undefined)
            
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


export const toggleItem = (id, category, equipped) => {
    return async dispatch => {
        try {
            const res = await axios.patch('/user/myItems/equip', {id, category, equipped})
            const profile = res.data
            profile.avatar = profile.avatar ? ('data:image/png;base64,' + profile.avatar) : (undefined)
            
            delete profile._id
            dispatch({type: 'UPDATE_PROFILE_DATA', profile})

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
            profile.avatar = profile.avatar ? ('data:image/png;base64,' + profile.avatar) : (undefined)
            
            delete profile._id
            dispatch({type: 'UPDATE_PROFILE_DATA', profile})

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

