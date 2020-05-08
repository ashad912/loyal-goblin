import jwt from 'jsonwebtoken'
import moment from 'moment'
import mongoose from 'mongoose'
import {User} from '@models/user'
import {Admin} from '@models/admin'
import { Mission } from '@models/mission'

const adminId = new mongoose.Types.ObjectId()
export const admin = {
    _id: adminId,
    email: 'admin@goblin.com',
    password: 'admingoblinadmingoblin',
    token: jwt.sign({_id: adminId}, process.env.ADMIN_JWT_SECRET)
}

const userId = new mongoose.Types.ObjectId()
export const user = {
    _id: userId,
    email: 'user1@goblin.com',
    password: 'user1goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({_id: userId}, process.env.JWT_SECRET)
    }]
}

const mission1 = {
    "title": "missiontest",
    "description": "desc",
	"imgSrc": "img.png",
	"activationDate": moment().add(5, 's').toISOString(),
	"expiryDate": moment().add(10, 'd').toISOString(),
	"minPlayers": 3,
	"maxPlayers": 5,
	"level": 1,
	"experience": 1000,
	"strength": 1,
	"dexterity": 1,
	"magic": 1,
	"endurance": 1,
	"unique": false,
	"completedByUsers": [],
}

const mission2 = {
    "title": "missiontest",
    "description": "desc",
	"imgSrc": "img.png",
	"activationDate": moment().add(5, 's').toISOString(),
	"expiryDate": moment().add(10, 'd').toISOString(),
	"minPlayers": 3,
	"maxPlayers": 5,
	"level": 1,
	"experience": 1000,
	"strength": 1,
	"dexterity": 1,
	"magic": 1,
	"endurance": 1,
	"unique": false,
	"completedByUsers": [],
}

export const setup = async () => {
    await Admin.deleteMany()
    await Mission.deleteMany()
    await User.clear()
    await new User(user).save()
    await new Admin(admin).save()

    await new Mission(mission1).save()
    await new Mission(mission2).save()
}

export const restore = async () => {
    await Mission.deleteMany()
    await new Mission(mission1).save()
    await new Mission(mission2).save()
}