import axios from 'axios'


export const getFirstRally = () => {
    return(dispatch) => {
        return new Promise (async (resolve, reject) => {
            try {
                
                const res = await axios.get('/rally/first')
                //console.log(res.data)
                dispatch({type: 'UPDATE_RALLY', rally: res.data ? res.data : null})
                resolve(res.data ? res.data : null)
            }catch (e) {
                reject(e)     
            } 
        })
    }
    
}

