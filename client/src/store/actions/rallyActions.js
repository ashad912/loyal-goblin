import axios from 'axios'


export const getFirstRally = () => {
    return(dispatch) => {
        return new Promise (async (resolve, reject) => {
            try {
                
                const res = await axios.get('/rally/first')
                const rally = res.data ? res.data : null
                
                dispatch({type: 'UPDATE_RALLY', rally})
                resolve(rally)
            }catch (e) {
                reject(e)     
            } 
        })
    }
    
}

