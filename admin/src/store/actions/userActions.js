import axios from 'axios'

export const getAdminUsers = () => {
    return new Promise (async (resolve, reject) => {
        try {
            console.log('getAdminUsers')
            const res = await axios.get('/user/adminUsers')
           // console.log(res.data)
            resolve(res.data)
        }catch (e) {
            reject(e)     
        } 
    })
}


export const toggleUserActiveStatus = (user) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(user.active){
                console.log('banUser')
                await axios.patch('/user/ban', {_id: user._id})
                resolve()
            }else{
                console.log('unbanUser')
                await axios.patch('/user/unban', {_id: user._id})
                resolve()
            }
        }catch (e) {
            console.log(e)
            reject(e)     
        } 
    })
          
}