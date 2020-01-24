import axios from 'axios'

export const getProducts = (params) => {
    return new Promise (async (resolve, reject) => {
        try {
            const query = params && params.onlyNames ? '?onlyNames=true' : ''

            console.log('getProducts')
            const res = await axios.get('/product/products' + query)
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

export const getAdminOrders = (page, rowsPerPage, fromDate, toDate, nameFilter) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getOrders')
            const query = `?page=${page}&rowsPerPage=${rowsPerPage}&from=${fromDate}&to=${toDate}&name=${nameFilter}`
            const res = await axios.get('/product/orders' + query)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}