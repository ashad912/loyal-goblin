
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

export const createItemModel = (itemModel) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('createItemModel')
            const res = await axios.post('/item/createModel', itemModel)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const updateItemModel = (itemModel) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('updateItemModel')
            const res = await axios.patch('/item/updateModel', itemModel)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const uploadItemModelImages = (id, formData) => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await axios.patch('/item/uploadModelImages/' + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              })
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}