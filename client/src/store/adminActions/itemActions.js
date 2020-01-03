
import axios from 'axios'

export const getItemModels = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getItemModels')
            const res = await axios.get('/item/modelList')
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}