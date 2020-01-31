import axios from 'axios'


export const getFirstRally = () => {
    return new Promise (async (resolve, reject) => {
        try {
            
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

