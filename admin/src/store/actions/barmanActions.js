import axios from 'axios'


export const getBarmans = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getBarmans')
            const res = await axios.get('/barman/')
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const registerBarman = (userName, password, confirmPassword) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(password !== confirmPassword){
                throw new Error("Hasła nie zgadzają się")
            }
            console.log('createBarman')
            const res = await axios.post('/barman/register', {userName, password})
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const changeBarmanPassword = (_id, password, confirmPassword) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(password !== confirmPassword){
                throw new Error("Hasła nie zgadzają się")
            }
            console.log('changeBarmanPassword')
            const res = await axios.patch("/barman/changePasswordAdmin/", {_id, password})
            console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}

export const deleteBarman = (_id) => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('deleteBarman')
            const res = await axios.delete('/barman/delete', {data: {_id}})
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}