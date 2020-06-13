/**
 * @jest-environment node
 */

import supertest from 'supertest'
import moment from 'moment'
import server from '@app'
import {Rally} from '@models/rally'
import {admin, setup, restore} from '@tests/utils/integration/rally'
import rallyStore from '@store/rally.store'


const app = () => supertest(server)

beforeEach(setup)



describe('Rally create endpoint', () => {

    describe('should create new rally', () => {
        beforeEach(restore)
        afterEach(rallyStore.destroyCronTask)

        

        it('when new rally has earlier dates then existing one', async () => {
            const res = await app()
                    .post('/rally/create')
                    .set('Authorization', `Bearer ${admin.token}`)
                    .send({
                        "title" : "rallytest",
                        "activationDate": moment().add(2, 's').toISOString(),
                        "startDate": moment().add(4, 's').toISOString(),
                        "expiryDate": moment().add(8, 's').toISOString(),
                        "description" : "rallydesc",
                        "experience" : 1000,
                    }).expect(201)   

            const firstRally = await Rally.find({expiryDate: { $gte: new Date() } }).sort({"activationDate": 1 }).limit(1)
            
            expect(res.body).toEqual(firstRally[0]._id.toString())
        })

        it('when new rally has later dates then existing one', async () => {
            await app()
                    .post('/rally/create')
                    .set('Authorization', `Bearer ${admin.token}`)
                    .send({
                        "title" : "rallytest",
                        "activationDate": moment().add(62, 's').toISOString(),
                        "startDate": moment().add(64, 's').toISOString(),
                        "expiryDate": moment().add(66, 's').toISOString(),
                        "description" : "rallydesc",
                        "experience" : 1000,
                    }).expect(201)   
        })

        it('when new rally activation and start date are the same', async () => {
            await app()
                    .post('/rally/create')
                    .set('Authorization', `Bearer ${admin.token}`)
                    .send({
                        "title" : "rallytest",
                        "activationDate": moment().add(5, 's').toISOString(),
                        "startDate": moment().add(5, 's').toISOString(),
                        "expiryDate": moment().add(10, 's').toISOString(),
                        "description" : "rallydesc",
                        "experience" : 1000,
                    }).expect(201)   
        })
    })

    describe('should not create new rally', () => {
        beforeEach(restore)
        afterEach(rallyStore.destroyCronTask)

        it('when new rally has colliding dates with existing one', async () => {
            await app()
                    .post('/rally/create')
                    .set('Authorization', `Bearer ${admin.token}`)
                    .send({
                        "title" : "rallytest",
                        "activationDate": moment().add(20, 's').toISOString(),
                        "startDate": moment().add(22, 's').toISOString(),
                        "expiryDate": moment().add(24, 's').toISOString(),
                        "description" : "rallydesc",
                        "experience" : 1000,
                    }).expect(400)   
        })

        it('when new rally has invalid date order', async () => {
            await app()
                    .post('/rally/create')
                    .set('Authorization', `Bearer ${admin.token}`)
                    .send({
                        "title" : "rallytest",
                        "activationDate": moment().add(10, 's').toISOString(),
                        "startDate": moment().add(10, 's').toISOString(),
                        "expiryDate": moment().add(5, 's').toISOString(),
                        "description" : "rallydesc",
                        "experience" : 1000,
                    }).expect(400)   
        })

    })

})
