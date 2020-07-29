import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import moment from 'moment'
import {User} from '@models/user'
import keys from '@config/keys'

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()

export const userOne = {
    _id: userOneId,
    email: 'user1@goblin.com',
    password: 'user1goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({_id: userOneId}, keys.jwtSecret)
    }]
}

export const userTwo = {
    _id: userTwoId,
    email: 'user2@goblin.com',
    password: 'user2goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [],
}

export const userThree = {
    _id: userThreeId,
    email: 'user3@goblin.com',
    password: 'user3goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({_id: userThreeId}, keys.jwtSecret)
    }],
    name: 'user3',
    sex: 'male',
    class: 'warrior'
}


export const setup = async () => {
    await User.clear()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new User(userThree).save()
}

export const restore = async () => {
    await User.clear()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new User(userThree).save()
}