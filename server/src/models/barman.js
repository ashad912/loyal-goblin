import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

import keys from '@config/keys'
import { getEndpointError } from '@utils/functions'
import { ERROR, WARN, INFO } from '@utils/constants'

const BarmanSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    token: {
        type: String
    }
})


BarmanSchema.methods.toJSON = function () { //like a middleware from express, we can use it with everythin
    const barman = this
    const barmanObject = barman.toObject() //thanks userObject we can manipulate data inside
    

    delete barmanObject.password
    delete barmanObject.token

    

    return barmanObject
}

BarmanSchema.methods.generateAuthToken = async function () { //on instances
    const barman = this
    const token = jwt.sign({_id: barman._id.toString()}, keys.barmanJwtSecret)

    barman.token = token
    await barman.save()

    return token
}


BarmanSchema.methods.updatePassword = async function(oldPassword, newPassword) {
    const barman = this;
  
    return new Promise((resolve, reject) => {
      bcrypt.compare(oldPassword, barman.password, (err, res) => {
        if (res) {
          barman.password = newPassword
  
          resolve(barman);
        } else {
          reject();
        }
      });
    });
}




BarmanSchema.statics.findByCredentials = async (userName, password) => {
    const barman = await Barman.findOne( {userName})
    

    if(!barman) {
        throw getEndpointError(INFO, 'Unable to login', userName)
    }

    const isMatch = await bcrypt.compare(password, barman.password)

    if(!isMatch) {
        throw getEndpointError(INFO, 'Unable to login', userName)
    }
    

    return barman
}


BarmanSchema.pre('save', async function(next){//middleware, working with static User.create!!

    const barman = this

    if(barman.isModified('password')){ //mongoose method
        barman.password = await bcrypt.hash(barman.password, 8)
    }

    next()

})



export const Barman = new mongoose.model("barman", BarmanSchema);
