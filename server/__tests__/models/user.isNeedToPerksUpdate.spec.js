/**
 * @jest-environment node
 */


import moment from 'moment'

import {connect, disconnect} from '@tests/utils/mongoose'
import {user, setup, restore} from '@tests/utils/models/user.isNeedToPerksUpdate'

beforeAll(async () => {
    //await connect()
    
})


describe("Perks update method", () => {
 
    beforeAll(async () => {
        //await setup()
    })
    
    describe('should update perksUpdatedAt date', () => {
        it('when perksUpdatedAt has equal hour and last update has not been longer than an hour',  () => {
            user.perksUpdatedAt = moment.utc() - (moment.utc() % 3600000)
            expect(user.isNeedToPerksUpdate()).toEqual(true)
        })

        it('when perksUpdatedAt has equal hour excluding msc and last update has not been longer than an hourr',  () => {
            user.perksUpdatedAt = moment.utc() - (moment.utc() % 3600000) + 999
            expect(user.isNeedToPerksUpdate()).toEqual(true)
        })

        it('when last update has been longer than an hour',  () => {
            user.perksUpdatedAt = moment.utc() - 3600001
            expect(user.isNeedToPerksUpdate()).toEqual(true)
        })

        it('when last update has been 24 hours ago',  () => {
            user.perksUpdatedAt = moment.utc() - 24*3600000
            expect(user.isNeedToPerksUpdate()).toEqual(true)
        })
    })

    describe('should not update perksUpdatedAt date', () => {
        it('when perksUpdatedAt has not equal hour and last update has been at least one second after last equal hour',  () => {
            user.perksUpdatedAt = moment.utc() - (moment.utc() % 3600000) + 1000
            expect(user.isNeedToPerksUpdate()).toEqual(false)
        })

    })
})


afterAll( async() => {
    //await disconnect()
})