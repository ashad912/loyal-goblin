import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const BarmanSchema = new mongoose.Schema({
    userName: {
        type:String,
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
    const token = jwt.sign({_id: barman._id.toString()}, process.env.BARMAN_JWT_SECRET)

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
  
          resolve(user);
        } else {
          reject();
        }
      });
    });
}




BarmanSchema.statics.findByCredentials = async (userName, password) => {
    const barman = await Barman.findOne( {userName})
    

    if(!barman) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, barman.password)

    if(!isMatch) {
        throw new Error('Unable to login')
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
