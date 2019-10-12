import axios from 'axios'

export const signIn = (credentials) => {
    return (dispatch, getState) => {
        return new Promise( async (resolve, reject) => {
            try {
                const res = await axios.post('/user/login', credentials)
                const uid = res.data
                dispatch( {type: "LOGIN_SUCCESS", uid})
                resolve()
            } catch (e) {
                const language = null//getState().canvas.language
                dispatch( {type: "LOGIN_ERROR", language})
                reject(e)
            }
        })
    }

}

export const signUp = (credentials) => {
    return null
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
                dispatch ( {type: "LOGOUT_SUCCESS"})
                resolve()
            } catch (e) {
                resolve()
            }
            
        })
    }
}

export const authCheck =  () => {
    return dispatch => {
        return new Promise( async (resolve, reject) => {
            try {
                const res = await axios('/user/me')
                const profile = res.data
                const uid = profile._id
                delete profile._id
                dispatch( {type: "AUTH_SUCCESS", profile, uid}) //DISPATCH IS SYNCHRONOUS!!!
                
            } catch (e) {
                dispatch( {type: "NO_AUTH", error: e})
                signOut();
                
            }
            resolve()
            
        })
    }
}