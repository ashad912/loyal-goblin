
import axios from 'axios'

export const getEvents = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getEvents')
            // /mission/events gets both missions and rallies
            const res = await axios.get('/mission/events')
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const getRallies = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getRallies')
            // /mission/events gets both missions and rallies
            const res = await axios.get('/rally/listEventCreator')
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const createEvent = (eventType, event) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('createEvent')
            const res = await axios.post(`/${eventType}/create/`, event)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const updateEvent = (eventType, event) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('updateEvent')
            const res = await axios.patch(`/${eventType}/update/`, event)
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}


export const uploadEventIcon = (eventType, id, formData) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('uploadEventIcon')
            const res = await axios.patch(`/${eventType}/uploadIcon/` + id, formData, {
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

export const deleteEvent = (eventType, _id) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('deleteEvent')
            const res = await axios.delete(`/${eventType}/remove/`, {data: {_id}})
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}
