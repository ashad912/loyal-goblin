/**
 * @jest-environment node
 */

import moment from 'moment'
import mongoose from 'mongoose'



import { Item } from '@models/item'
import { User } from '@models/user'
import {Rally} from '@models/rally'

import rallyStore from '@store/rally.store'

import {connect, disconnect} from '@tests/utils/mongoose'
import {setup, restore} from '@tests/utils/store/rally.finish'


beforeAll(async () => {
    await connect()
})

describe("Rally update queue", () => { 

    let rallies = [
    
        {
            _id: new mongoose.Types.ObjectId(),
            title: 'rallytest',
            description: 'desc',
            experience: 0,
            activationDate: moment().toISOString(),
            startDate: moment().add(2, 's').toISOString(),
            expiryDate: moment().add(4, 's').toISOString(),
        },

        {
            _id: new mongoose.Types.ObjectId(),
            title: 'rallytest',
            description: 'desc',
            experience: 0,
            activationDate: moment().add(10, 's').toISOString(),
            startDate: moment().add(12, 's').toISOString(),
            expiryDate: moment().add(14, 's').toISOString(),
        },

        {
            _id: new mongoose.Types.ObjectId(),
            title: 'rallytest',
            description: 'desc',
            experience: 0,
            activationDate: moment().subtract(10, 's').toISOString(),
            startDate: moment().subtract(8, 's').toISOString(),
            expiryDate: moment().subtract(6, 's').toISOString(),
        },

    ]   

    beforeEach(restore)
    afterEach(rallyStore.destroyCronTask)

    it('should schedule rally', async () => {
        await Rally.create(rallies[0])

        const rally = await rallyStore.updateQueue()

        expect(rally._id.toString()).toEqual(rallies[0]._id.toString())

        
    })

    it('should not schedule rally', async() => {
        await Rally.create(rallies[2])

        const rally = await rallyStore.updateQueue()

        expect(rally).toBeNull()
    })

    it('should schedule appropriate rally', async () => {
        await Rally.insertMany(rallies)

        const rally = await rallyStore.updateQueue()

        expect(rally._id.toString()).toEqual(rallies[0]._id.toString())

        
    })
   
})

describe("Rally finish", () => { 

    let rally, users, iModels

    beforeEach(async () => {
        const data = await setup()
        rally = data.rally
        users = data.users
        iModels = data.iModels
    })

    it('should add appropriate awards to users', async () => {
        await rallyStore.finish(rally)


        const items = await Item.find({
            $or: [
                {itemModel: iModels[0]._id},
                {itemModel: iModels[1]._id}
            ]
        })

        const user1 = await User.findById(users[0])
        const user2 = await User.findById(users[1]).populate('bag')
        const user3 = await User.findById(users[2]).populate('bag')

        expect(items.length).toEqual(5)

        expect(user1.bag.toObject()).toEqual([])
        expect(user2.bag.length).toEqual(2)
        expect(user3.bag.length).toEqual(3)

        expect(user2.bag.filter(item => item.itemModel._id.toString() === iModels[0]._id.toString()).length).toEqual(2)

        expect(user3.bag.filter(item => item.itemModel._id.toString() === iModels[0]._id.toString()).length).toEqual(1)
        expect(user3.bag.filter(item => item.itemModel._id.toString() === iModels[1]._id.toString()).length).toEqual(2)
    })
   
})

afterAll( async() => {
    await disconnect()
})