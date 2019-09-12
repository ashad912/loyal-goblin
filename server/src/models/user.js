import mongoose from 'mongoose'

const userClasses = ['warrior', 'mage', 'rogue', 'cleric']

const UserSchema = new mongoose.Schema({
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
    eq: [{ //i've thought about virtualization items
        item: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
    }],
    armor: { //i assumed that eq !== armor -> easier to handle perks issues, i guess
        head: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        breast: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        leftHand: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        rightHand: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        legs: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        },
        feets: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
    },
    loyal: { //is it appropriate structure?
        type: [{
            pressed: {
                type: Boolean, 
                required: true,
            }
        }],
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
            member: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user',
                unique: true
            }
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