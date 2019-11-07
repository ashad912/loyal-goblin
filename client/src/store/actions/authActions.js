import axios from 'axios'

export const signIn = (credentials) => {
    return (dispatch, getState) => {
        return new Promise( async (resolve, reject) => {
            //dispatch( {type: "LOADING", loading: true})
            try {
                const res = await axios.post('/user/login', credentials)
                const uid = res.data
                dispatch( {type: "LOGIN_SUCCESS", uid})
                //dispatch( {type: "LOADING", loading: false})
                resolve()
            } catch (e) {
                const language = null//getState().canvas.language
                dispatch( {type: "LOGIN_ERROR", language})
                //dispatch( {type: "LOADING", loading: false})
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
            //await dispatch( {type: "LOADING", loading: true})
            try{
                await axios.post('/user/logout')
                await dispatch ( {type: "LOGOUT_SUCCESS"})
                
                
            } catch (e) {
                await dispatch( {type: "NO_CONNECTION", error: e})
            }
            //await dispatch( {type: "LOADING", loading: false})
            resolve()
        })
    }
}

export const authCheck =  () => {
    return dispatch => {
        return new Promise( async (resolve, reject) => {
            //await dispatch( {type: "LOADING", loading: true})
            try {
                const res = await axios('/user/me')
                const profile = res.data
                const uid = profile._id
                delete profile._id
                await dispatch( {type: "AUTH_SUCCESS", profile, uid}) //DISPATCH IS SYNCHRONOUS!!!
                
            } catch (e) {
                await dispatch( {type: "NO_AUTH", error: e})
                await signOut();
                
            }
            resolve()
            //await dispatch( {type: "LOADING", loading: false})
            
            
        })
    }
}





