import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const userClasses = ['warrior', 'mage', 'rogue', 'cleric']

const LoyalSchema = new mongoose.Schema({  
    pressed: {
        type: Boolean, 
        required: true,
    }   
})

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    }, // field options
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
    class: { //userClasses
        type: String,
        required: true
    },
    avatar: {
        type: Buffer
    },
    expPoints: {
        type: Number,
        default: 0,
        required: true
    },
    bag: [{ 
        item: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
    }],
        //Nie wiem jak z typami itemów w samym obiekcie item
        /*amulet: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        weapon: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        chest: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        legs: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        hands: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        feet: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        head: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],
        ring: [{
            item: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'item',
                        unique: true
                    }}
        ],*/
    equipped: {
        //Nie wiem jak z typami itemów w samym obiekcie item
        amulet: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
        ,
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
        }
        ,
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
    // eq: [{ //i've thought about virtualization items
    //     item: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     }
    // }],
    // armor: { //i assumed that eq !== armor -> easier to handle perks issues, i guess
    //     head: { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     },
    //     breast: { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     },
    //     leftHand: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     },
    //     rightHand: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     },
    //     legs: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     },
    //     feets: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'item',
    //         unique: true
    //     }
    // },
    loyal: { //is it appropriate structure?
        type: [LoyalSchema],
        required: true
    },
    friends: [{
        friend : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
            unique: true
        }
    }],
    party: { //suggested struct - EXPERIMENTAL
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
    }
    
}, {
    timestamps: true
})



UserSchema.virtual('events', { //events can be reached by relations, BI RELATION!!
    ref: 'event',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'users.user' //relation from event side
})

UserSchema.virtual('activeEvent', { //events can be reached by relations, BI RELATION!!
    ref: 'eventInstance',
    localField: '_id', //relation from user side (we are in user schema!)
    foreignField: 'party.user' //relation from event side
})


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

export const User = new mongoose.model('user', UserSchema)