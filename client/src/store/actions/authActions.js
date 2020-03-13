import axios from 'axios'

export const validatePasswordChangeToken = (token) => {
    return new Promise (async (resolve, reject) => {
        try{
            await axios.post('/user/validatePasswordChangeToken', {token: token})
            resolve()
        }catch(e){
            reject(e)
        }
    })
}

export const signIn = (credentials) => {
    return (dispatch, getState) => {
        return new Promise( async (resolve, reject) => {

            try {
                const res = await axios.post('/user/login', credentials)
                const profile = res.data
                const uid = profile._id
                profile.avatar = profile.avatar ? ( profile.avatar) : (undefined)
                delete profile._id
                dispatch( {type: "LOGIN_SUCCESS", profile, uid})

                resolve()
            } catch (e) {
                const language = null
                dispatch( {type: "LOGIN_ERROR", language})

                reject(e)
            }
        })
    }

}

export const signUp = (credentials) => {
    return (dispatch) => {
        return new Promise( async (resolve, reject) => {

            try {
                const res = await axios.post('/user/create', credentials)
                const profile = res.data
                const uid = profile._id
                profile.avatar = profile.avatar ? ( profile.avatar) : (undefined)
                delete profile._id
                dispatch( {type: "LOGIN_SUCCESS", profile, uid})

                resolve()
            } catch (e) {
                
                console.error(e)
                dispatch( {type: "SIGNUP_ERROR", messageCode: e.response.data.code})

                reject(e)
            }
        })
    }
}

/* req with using fetch instead axios - u have stringify data
const res = await fetch('/api/ninjas/login', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                'Content-Type': 'application/json'
                }
            })
const data = res.json() //and unstrinify lol

*/


export const signOut = () => {
    return dispatch => {
        return new Promise( async (resolve, reject) => {

            try{
                await axios.post('/user/logout')
                dispatch ( {type: "DELETE_PARTY"})
                dispatch ( {type: "LOGOUT_SUCCESS"})
                
                
            } catch (e) {
                dispatch( {type: "NO_CONNECTION", error: e})
            }

            resolve()
        })
    }
}

export const authCheck =  (params) => {
    return dispatch => {

        return new Promise( async (resolve, reject) => {
            try {
               // console.log('authCheck')
                let query = ''
                if(params && params.autoFetch){
                    query ='?autoFetch=true'
                }
                const res = await axios('/user/me' + query)
                const profile = res.data
                
                const uid = profile._id
                delete profile._id
                dispatch( {type: "AUTH_SUCCESS", profile, uid}) //DISPATCH IS SYNCHRONOUS!!!

                resolve(uid)
                
            } catch (e) {
                dispatch( {type: "NO_AUTH", error: e})
                signOut();
                resolve(null)
                
            }
            
            
        })
    }
}



export const forgotPassword = (email, recaptchaToken) => {
    return async dispatch => {
        try {
            if(email){
                await axios.post('/user/forgotPassword', {email, recaptchaToken})

            }

        } catch (e) {
            console.log(e)
            
            if(e.response.data === 'jwt not expired'){
                return e.response.data
            }else{
                dispatch( {type: "NO_CONNECTION", error: e})     
            }
        }
    }
}
            

export const changePassword = (oldPassword, password, confirmPassword, token) => {
    return async dispatch => {
        try {
            if(password === confirmPassword){
                //console.log(oldPassword, password, confirmPassword, token)
                const res = await axios.patch('/user/changePassword', {oldPassword, password, confirmPassword, token})
                if(res){
                    signOut()
                }
            }

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}



export const resetPassword = (token, password, confirmPassword, recaptchaToken) => {
    return async dispatch => {
        try {
            if(password === confirmPassword){
                const res = await axios.patch('/user/reset', {token, password, confirmPassword, recaptchaToken})
                if(res){
                    //signOut()
                }
            }

        } catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}




export const setMultipleSession = () => {
    return dispatch => {
        dispatch( {type: "MULTIPLE_SESSION"})   
    }
}
    




