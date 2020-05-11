import mongoose from 'mongoose'
import {User} from '@models/user'

export const setup = async () => {
    
    await User.deleteMany({})
    return
}

export const restore = async () => {
   
}


export const user = new User ({ 

    _id: new mongoose.Types.ObjectId(), 
    "name": "user1",
    "email": "user1@test.com",
    "password": "usertest",
    "active": true,
    "experience": 0,
    "class": "warrior",
    "bag": [],
    "equipped": {},
    "statistics": {
        "rallyCounter": 0,
        "missionCounter": 0
    },
    "activeOrder":  [],
    "loyal": {}, 
})