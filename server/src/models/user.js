import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {Item} from './item'
import {ProductsOrderSchema} from '../schemas/ProductsOrderSchema'

import arrayUniquePlugin from 'mongoose-unique-array'

const userClasses = ['warrior', 'mage', 'rogue', 'cleric']

const userStatuses = ['home', 'away', 'banned', 'nonactivated']

const LoyalSchema = new mongoose.Schema({  
    pressed: {
        type: Boolean, 
        required: true,
    }   
})



export const UserSchema = new mongoose.Schema({
    
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
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    active: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
    },
    avatar: {
        type: Buffer
    },
    name: {
        type: String,
    },
    sex : {
        type: String,
    },
    class: { //userClasses
        type: String,
    },
    attributes: {
        strength: {
            type: Number,
            default: 0,
        },
        dexterity: {
            type: Number,
            default: 0,
        }, 
        magic: {
            type: Number,
            default: 0,
        },
        endurance: {
            type: Number,
            default: 0,
        },
    },
    experience: {
        type: Number,
        default: 0,
        required: true
    },
    bag: {
        type: [{  //for plugin proper work - bag field is required while user is being created
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }],
        required: true,
    },
    equipped: {
        weaponRight: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        weaponLeft: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        chest: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
        ,
        legs: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
        ,
        hands: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        feet: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        head: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        ringRight: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        ringLeft: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
    },
    loyal: { //is it appropriate structure?
        type: [LoyalSchema],
        required: true
    },
    party: { //suggested struct - EXPERIMENTAL
        name: {type: String},
        leader: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
            unique: true
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
            unique: true
        }]       
    },
    activeOrder: {
        users: [{
            user: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user',
                unique: true
            },
            products: [ProductsOrderSchema]
        }]
    },
    statistics: {
        missionCounter: {
            type: Number,
            default: 0,
            required: true,
        },
        rallyCounter: {
            type: Number,
            default: 0,
            required: true,
        },
        amuletCounters: [{
            counter: {
                type: Number,
                required: true,
            },
            amulet: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'itemModel',
                unique: true
            }
        }]

    },
    userPerks: {
        attrStrength: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        attrDexterity: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        attrMagic: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        attrEndurance: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        rawExperience: {
            absolute: {
                type: String,
                default: '0',
            },
            percent: {
                type: String,
                default: '0%',
            }
        },
        products: [{
            type: mongoose.Schema.Types.Mixed,
        }]
    }
    
}, {
    timestamps: true
})

// UserSchema.virtual('missions', { //events can be reached by relations, BI RELATION!!
//     ref: 'mission',
//     localField: '_id', //relation from user side (we are in user schema!)
//     foreignField: 'completedByUsers.user' //relation from event side
// })

//it is recognized as an array
UserSchema.virtual('activeMission', { //events can be reached by relations, BI RELATION!!
    ref: 'missionInstance',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'party.user' //relation from event side
})

UserSchema.virtual('activeRally', { //events can be reached by relations, BI RELATION!!
    ref: 'rally',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'users.profile' //relation from event side
})


UserSchema.plugin(arrayUniquePlugin)

UserSchema.methods.generateAuthToken = async function () { //on instances
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}



UserSchema.methods.toJSON = function () { //like a middleware from express, we can use it with everythin
    const user = this
    const userObject = user.toObject() //thanks userObject we can manipulate data inside
    
    delete userObject.email
    delete userObject.password
    delete userObject.tokens

    

    return userObject
}


UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email: email})
    

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }
    

    return user
}

UserSchema.pre('save', async function(next){//middleware, working with static User.create!!

    const user = this

    if(user.isModified('password')){ //mongoose method
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})

UserSchema.pre('remove', async function(next){
    const user = this
    await Item.deleteMany({owner: user._id})
    next()
})

export const User = new mongoose.model('user', UserSchema)