
import axios from 'axios'

export const getEvents = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getEvents')
            // /mission/events gets both missions and rallies
            const res = await axios.get('/missions/events')
            console.log(res)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const createEvent = (eventType, event) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('createMission')
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
            console.log('updateMission')
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