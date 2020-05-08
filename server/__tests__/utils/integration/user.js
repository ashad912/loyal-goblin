import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import moment from 'moment'
import {User} from '@models/user'

const userOneId = new mongoose.Types.ObjectId()
export const userOne = {
    _id: userOneId,
    email: 'user1@goblin.com',
    password: 'user1goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}


export const setup = async () => {
    await User.clear()
    await new User(userOne).save()
}