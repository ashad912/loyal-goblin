/**
 * @jest-environment node
 */

import supertest from 'supertest'
import getApp from '@app'
import {User} from '@models/user'
import {userOne, userTwo, userThree, setup, restore} from '@tests/utils/integration/user'

const server = getApp()

const app = () => supertest(server)

beforeEach(setup)

describe('Login endpoint', () => {

    beforeEach(restore)

    it('should login existing user', async () => {
        const res = await app().post('/user/login').send({
            email: userOne.email,
            password: userOne.password
        })
    
        //console.log(res)
    
        expect(res.status).toBe(200)
    
        const user = await User.findById(userOne._id)
        expect(res.header['set-cookie'][0]).toMatch(user.tokens[1].token) //want to take second token - first was generated during singing up
    
    })

    it('should not login existing user', async () => {


        const res = await app().post('/user/login').send({
            email: userTwo.email,
            password: 'dummypassword'
        })
    
        //console.log(res)
    
        expect(res.status).toBe(400)
    
        const user = await User.findById(userTwo._id)
        expect(user.tokens.toObject()).toEqual([])
    
    })

})

describe('Char creation endpoint', () => {
    beforeEach(restore)

    it('should create new name, sex and class', async () => {
        const res = await app()
            .patch('/user/character')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'user1',
                sex: 'male',
                characterClass: 'warrior',
                attributes: {
                    strength: 2,
                    dexterity: 2,
                    magic: 2,
                    endurance: 2
                }
            })
        
        expect(res.status).toBe(201)

        const user = await User.findById(userOne._id)
        expect(user.name).toEqual('user1')
        expect(user.sex).toEqual('male')
        expect(user.class).toEqual('warrior')
        expect(user.attributes.strength).toEqual(2)
        expect(user.attributes.dexterity).toEqual(2)
        expect(user.attributes.magic).toEqual(2)
        expect(user.attributes.endurance).toEqual(2)

    })

    it('should not create new user name, sex and class', async () => {
        const res = await app()
            .patch('/user/character')
            .set('Authorization', `Bearer ${userThree.tokens[0].token}`)
            .send({
                name: 'user3',
                sex: 'male',
                characterClass: 'warrior',
                attributes: {
                    strength: 2,
                    dexterity: 2,
                    mage: 2,
                    endurance: 2
                }
            })
        
        expect(res.status).toBe(400)


    })
})
