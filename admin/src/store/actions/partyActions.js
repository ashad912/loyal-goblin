import axios from 'axios'

export const getAdminParties = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getAdminParties')
            const res = await axios.get('/party/adminParties')
          //  console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const deleteParty = (_id) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('deleteParty')
            await axios.delete('/party/adminRemove', {data: {_id}})
            resolve()
        }catch (e) {
            reject(e)     
        } 
    })
}