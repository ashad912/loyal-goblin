/**
 * @jest-environment node
 */

import supertest from 'supertest'
import server from '@app'
import {User} from '@models/user'
import {userOne, setupDatabase} from '@tests/utils/user'

const app = () => supertest(server)

beforeEach(setupDatabase)


test('Should login existing user', async () => {
    const res = await app().post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    })

    //console.log(res)

    expect(res.status).toBe(200)

    const user = await User.findById(userOne._id)
    expect(res.header['set-cookie'][0]).toMatch(user.tokens[1].token) //want to take second token - first was generated during singing up

})