/**
 * @jest-environment node
 */

import supertest from 'supertest'
import moment from 'moment'
import { user1, user2, user3, admin, setup, restore } from '@tests/utils/integration/mission'


// Little hack to have loaders invoked, import/export is synchronous
let app
beforeAll(async () => {
    const server = await require('@app').default()
    app = () => supertest(server)
})

beforeEach(setup)

describe('Mission create endpoint', () => {
    it('should create new mission', async () => {
        await app()
            .post('/mission/create')
            .set('Authorization', `Bearer ${admin.token}`)
            .send({
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
            }).expect(201)
    })
})

describe('Mission get endpoint', () => {
    beforeEach(restore)

    it('should return missions list', async () => {
        await app()
            .get('/mission/list')
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .expect(200)
    })

    it('should return one mission', async () => {
        const res = await app()
            .get('/mission/list')
            .set('Authorization', `Bearer ${user2.tokens[0].token}`)

        expect(res.status).toBe(200)
        expect(res.body.missions.length).toEqual(1)
        expect(res.body.missions[0].title).toEqual('mission2')
        expect(res.body.missionInstanceId).toBeNull()
    })
})
