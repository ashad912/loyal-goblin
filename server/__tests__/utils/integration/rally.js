import jwt from 'jsonwebtoken'
import moment from 'moment'
import mongoose from 'mongoose'
import {Admin} from '@models/admin'
import { Rally } from '@models/rally'
import keys from '@config/keys'

const adminId = new mongoose.Types.ObjectId()
export const admin = {
    _id: adminId,
    email: 'admin@goblin.com',
    password: 'admingoblinadmingoblin',
    token: jwt.sign({_id: adminId}, keys.adminJwtSecret)
}


const rally1 = {
    "title" : "rallytest1",
    "activationDate": moment().add(20, 's').toISOString(),
    "startDate": moment().add(40, 's').toISOString(),
    "expiryDate": moment().add(60, 's').toISOString(),
    "description" : "rallydesc",
    "experience" : 1000,
}

const rally2 = {
    "title" : "rallytest2",
    "activationDate": moment().subtract(30, 's').toISOString(),
    "startDate": moment().subtract(20, 's').toISOString(),
    "expiryDate": moment().subtract(10, 's').toISOString(),
    "description" : "rallydesc",
    "experience" : 1000,
}

export const setup = async () => {
    await Admin.deleteMany()
    await Rally.deleteMany()
    await new Admin(admin).save()

    await new Rally(rally1).save()
    await new Rally(rally2).save()
}

export const restore = async () => {
    await Rally.deleteMany()
    await new Rally(rally1).save()
    await new Rally(rally2).save()
}