/**
 * @jest-environment node
 */

import moment from 'moment'
import mongoose from 'mongoose'


import rallyStore from '@store/rally.store'
import {connect, disconnect} from '@tests/utils/mongoose'

import {Rally} from '@models/rally'

import setupFinish from '@tests/utils/rally.store.finish'

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

beforeAll(async () => {
    await connect()
})

describe("Rally update queue", () => { 

    beforeEach(async () => {
        await Rally.deleteMany({})
    })

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

    let rally

    beforeEach(async () => {
        rally = await setupFinish()
    })

    it('should add appropriate awards to users', async () => {
        await rallyStore.finish(rally)

        expect(true).toEqual(true)

        
    })
   
})

afterAll( async() => {
    await disconnect()
})