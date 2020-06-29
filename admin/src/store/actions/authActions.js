import axios from 'axios'

export const signIn = (credentials) => {
    return (dispatch, getState) => {
        return new Promise( async (resolve, reject) => {

            try {
                const res = await axios.post('/admin/login', credentials)
                const uid = res.data._id
                dispatch( {type: "LOGIN_SUCCESS", uid})

                resolve()
            } catch (e) {
                const language = null
                dispatch( {type: "LOGIN_ERROR", language})

                reject(e)
            }
        })
    }

}

export const authCheck =  (params) => {
    return dispatch => {

        return new Promise( async (resolve, reject) => {
            try {
                
                const query = params && params.autoFetch ? '?autoFetch=true' : ''
                const res = await axios('/admin/me' + query)   
                const uid = res.data._id
                dispatch( {type: "AUTH_SUCCESS",  uid}) //DISPATCH IS SYNCHRONOUS!!!

                resolve(uid)
                
            } catch (e) {
                dispatch( {type: "NO_AUTH", error: e})
                signOut();
                resolve(null)
                
            }
            
            
        })
    }
}

export const signOut = () => {
    return dispatch => {
        return new Promise( async (resolve, reject) => {

            try{
                await axios.post('/admin/logout')
                await dispatch ( {type: "LOGOUT_SUCCESS"})
                
                
            } catch (e) {
                await dispatch( {type: "NO_CONNECTION", error: e})
            }

            resolve()
        })
    }
}