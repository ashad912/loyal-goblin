import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

export const AdminSchema = new mongoose.Schema({
    
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 15,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    token: {
        type: String,
        default: null
    }
    
})

AdminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne( {email: email})
    

    if(!admin) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }
    

    return admin
}

AdminSchema.methods.toJSON = function () { //like a middleware from express, we can use it with everythin
    const admin = this
    const adminObject = admin.toObject() //thanks adminObject we can manipulate data inside
    
    delete adminObject.email
    delete adminObject.password
    delete adminObject.token

    

    return adminObject
}

AdminSchema.methods.generateAuthToken = async function () { //on instances
    const admin = this
    const token = jwt.sign({_id: admin._id.toString()}, process.env.ADMIN_JWT_SECRET)

    admin.token = token
    await admin.save()

    return token
}


export const Admin = new mongoose.model('admin', AdminSchema)