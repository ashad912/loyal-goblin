/**
 * @jest-environment node
 */

import supertest from 'supertest'
import moment from 'moment'
import server from '@app'
import {Mission} from '@models/mission'
import {user, admin, setup, restore} from '@tests/utils/integration/mission'
//import missionStore from '@store/mission.store'

const app = () => supertest(server)

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

describe('Mission get endpoint',()=> {
    it('should return missions list', async () => {
        await app()
                .get('/mission/list')
                .set('Authorization', `Bearer ${user.tokens[0].token}`)
                .expect(200)  
    })
})
