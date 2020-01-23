import mongoose, { Mongoose } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {Item} from './item'
import {Party} from './party'
import {Rally} from './rally'
import {ProductsOrderSchema} from '../schemas/ProductsOrderSchema'
import {ClassAwardsSchema} from '../schemas/ClassAwardsSchema'
import {LoyalSchema} from '../schemas/LoyalSchema'

import arrayUniquePlugin from 'mongoose-unique-array'
import { asyncForEach } from '../utils/methods'

const userClasses = ['warrior', 'mage', 'rogue', 'cleric']

const userStatuses = ['home', 'away', 'banned', 'nonactivated']


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
    passwordChangeToken: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
    },
    avatar: {
        type: String,
        maxlength: 20
    },
    lastActivityDate: {
        type: Date,
    },
    name: {
        type: String,
        unique: true
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
        min: 0,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
    },
    bag: {
        type: [{  //for plugin proper work - bag field is required while user is being created
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
        }],
        required: true,
    },
    equipped: {
        weaponRight: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        weaponLeft: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        chest: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        }
        ,
        legs: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        }
        ,
        hands: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        feet: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        head: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
           // unique: true,
            default: null
        },
        ringRight: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        ringLeft: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        hands: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        scroll: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
        torpedo: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            //unique: true,
            default: null
        },
    },
    loyal: {
        type: LoyalSchema,
        required: true
    },
    party: { //suggested struct - EXPERIMENTAL
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'party',
        default: null      
    },
    activeOrder: [{
        profile: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
        },
        products: [ProductsOrderSchema],
        price: {type: Number, default: 0},
        experience: {type: Number, default: 0},
        awards: [{quantity: {type: Number, default: 0 }, itemModel: {type: mongoose.Schema.Types.ObjectId, ref: 'itemModel'}}],
        createdAt: {type: Date}
    }],
    statistics: {
        missionCounter: {
            type: Number,
            default: 0,
            
        },
        rallyCounter: {
            type: Number,
            default: 0,
            
        },
        amuletCounters: [{
            counter: {
                type: Number,
                required: true,
            },
            amulet: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'itemModel',
            }
        }]

    },
    rallyNotifications: {
        isNew: {
            type: Boolean, 
            default: false,
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
        },
        awards: [ClassAwardsSchema],
    },
    levelNotifications: {
        type: Number,
        default: 0,
        min: 0,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
    },
    perksUpdatedAt: Date,
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
        products: { //important change! [] -> {}
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }
    
}, {
    minimize: false, //to save {} as default
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
    foreignField: 'party.profile' //relation from event side
})

UserSchema.virtual('userRallies', { //events can be reached by relations, BI RELATION!!
    ref: 'rally',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'users.profile' //relation from event side
})



UserSchema.methods.generateAuthToken = async function () { //on instances
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}

UserSchema.methods.generatePasswordResetToken = async function () { //on instances
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn: '1h' })

    user.passwordChangeToken = token
    await user.save()

    return token
}

UserSchema.methods.updatePassword = async function(oldPassword, newPassword) {
    const user = this;
  
    return new Promise((resolve, reject) => {
      bcrypt.compare(oldPassword, user.password, (err, res) => {
        if (res) {
          user.password = newPassword
  
          resolve(user);
        } else {
          reject();
        }
      });
    });
}



UserSchema.methods.toJSON = function () { //like a middleware from express, we can use it with everythin
    const user = this
    const userObject = user.toObject() //thanks userObject we can manipulate data inside
    
    delete userObject.email
    delete userObject.password
    delete userObject.tokens

    

    return userObject
}

UserSchema.methods.checkPasswordChangeTokenExpired = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err && err.message === 'jwt expired'){
            return true
        }else{
            return false
        }
    })
   
}


UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email: email, active: true})
    

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }
    

    return user
}

UserSchema.statics.findByPasswordChangeToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne( {_id: decoded._id, active: true, passwordChangeToken: token})
    if(!user) {
        throw new Error('Nie znaleziono użytkownika')
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




//OK!
UserSchema.pre('remove', async function(next){
    const user = this
    await Item.deleteMany({owner: user._id})
   

    const party = await Party.findById(user.party)

    if(party){
        await party.remove()
    }
    
    

    //what else - rally
    await Rally.updateMany(
        {"$and": [
            { users: { $elemMatch: {profile:  user._id}}}, //wihout eq
            { $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]},
        ]},
        {$pull: {
            "users": {profile: user._id}
        }}
    )

    
    

    next()
})


UserSchema.plugin(arrayUniquePlugin)


export const User = new mongoose.model('user', UserSchema)