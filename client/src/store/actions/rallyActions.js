import axios from 'axios'


export const getFirstRally = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getFirstRally')
            const res = await axios.get('/rally/first')
            //console.log(res.data)
            if(!res.data){
                resolve(undefined)
            }
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

