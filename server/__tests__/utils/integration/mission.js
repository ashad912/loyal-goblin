import jwt from 'jsonwebtoken'
import moment from 'moment'
import mongoose from 'mongoose'
import { User } from '@models/user'
import { Admin } from '@models/admin'
import { Mission } from '@models/mission'
import { Party } from '@models/party'

export const setup = async () => {
    await Admin.deleteMany()
    await Mission.deleteMany()
    await User.clear()
    await Party.clear()
    await new User(user1).save()
    await new Admin(admin).save()

    await new Mission(mission1).save()
    await new Mission(mission2).save()

    await new Party(party).save()
    await new User(user2).save()
    await new User(user3).save()
}

export const restore = async () => {
    await Mission.deleteMany()
    await new Mission(mission1).save()
    await new Mission(mission2).save()
}

const adminId = new mongoose.Types.ObjectId()
const user1Id = new mongoose.Types.ObjectId()
const user2Id = new mongoose.Types.ObjectId()
const user3Id = new mongoose.Types.ObjectId()
const partyId = new mongoose.Types.ObjectId()


export const admin = {
    _id: adminId,
    email: 'admin@goblin.com',
    password: 'admingoblinadmingoblin',
    token: jwt.sign({ _id: adminId }, process.env.ADMIN_JWT_SECRET)
}

export const user1 = {
    _id: user1Id,
    email: 'user1@goblin.com',
    password: 'user1goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET)
    }]
}

export const user2 = {
    _id: user2Id,
    email: 'user2@goblin.com',
    password: 'user2goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({ _id: user2Id }, process.env.JWT_SECRET)
    }],
    party: partyId
}

export const user3 = {
    _id: user3Id,
    email: 'user3@goblin.com',
    password: 'user3goblin',
    active: true,
    perksUpdatedAt: moment().toISOString(),
    activeOrder: [],
    loyal: {},
    tokens: [{
        token: jwt.sign({ _id: user3Id }, process.env.JWT_SECRET)
    }],
    party: partyId
}

const party = {
    _id: partyId, 
    members: [
        user3Id
    ],
    inShop: false, 
    name: 'party',
    leader: user2Id
}

const mission1 = {
    "title": "mission1",
    "description": "desc",
    "imgSrc": "img.png",
    "activationDate": moment().subtract(5, 's').toISOString(),
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
    "completedByUsers": [user3Id],
}

const mission2 = {
    "title": "mission2",
    "description": "desc",
    "imgSrc": "img.png",
    "activationDate": moment().subtract(5, 's').toISOString(),
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


