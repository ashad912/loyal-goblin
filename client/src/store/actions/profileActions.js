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