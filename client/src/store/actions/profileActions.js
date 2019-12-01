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
                dispatch( {type: "AUTH_SUCCESS", profile, uid}) //DISPATCH IS SYNCHRONOUS!!!
            } catch (e) {
                console.log(e)
                dispatch( {type: "NO_CONNECTION", error: e})               
            }
            
            resolve()
            
        })
    }

}



export const toggleItem = (id, category, equipped) => {
    return async dispatch => {
        try {
            const res = await axios.patch('/user/myItems/equip', {id, category, equipped})
            dispatch({type: 'UPDATE_PROFILE_DATA', profile: res.data})

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
            dispatch({type: 'UPDATE_PROFILE_DATA', profile: res.data})

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

