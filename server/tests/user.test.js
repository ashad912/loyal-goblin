import request from 'supertest'
import { app } from '../src/app'
import {User} from '../src/models/user'
import {userOne, setupDatabase} from './fixtures/user'


beforeEach(setupDatabase)


test('Should login existing user', async () => {
    const res = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOne._id)
    expect(res.header['set-cookie'][0]).toMatch(user.tokens[1].token) //want to take second token - first was generated during singing up

})