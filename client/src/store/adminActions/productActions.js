import axios from 'axios'

export const getProducts = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getProducts')
            const res = await axios.get('/product/products')
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const createProduct = (product) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('createProduct')
            const res = await axios.post('/product/create', product)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const updateProduct = (product) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('updateProduct')
            const res = await axios.patch('/product/update', product)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const deleteProduct = (_id) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('removeProduct')
            await axios.delete('/product/remove', {data: {_id}})
            //console.log(res.data)
            resolve()
        }catch (e) {
            reject(e)     
        } 
    })
}

export const uploadProductImage = (id, formData) => {
    return new Promise (async (resolve, reject) => {
        try {
            const res = await axios.patch('/product/uploadImage/' + id, formData, {
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