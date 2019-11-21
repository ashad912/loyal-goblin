import mongoose from 'mongoose'
import validator from 'validator'
import {ClassAwardsSchema} from '../schemas/ClassAwardsSchema'

export const eventStatuses = ['ready', 'active', 'archive', 'ended']



export const MissionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    activationDate: {
        type: Date
    },
    expiryDate: { //counted from time length (days, hours, minutes, seconds) passed by admin?
        type: Date
    },
    imgSrc: {
        type: String
    },
    minPlayers: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    maxPlayers: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    experience: {
        type: Number,
        min: 0,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },

    strength: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    dexterity: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    magic: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    endurance: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    minLevel: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unique: Boolean, //active only once
    amulets: [{   
        quantity: Number,
        itemModel: { //for fixation: https://stackoverflow.com/questions/48501410/mongoose-how-to-get-an-object-instead-of-an-object-reference-in-a-getter
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'itemModel'
        }  
    }],
    completedByUsers: [{ //user whoes have finished the events - to query available events for specific user -> for users statistics used virtualization by user side
        type: mongoose.Schema.Types.ObjectId, //id in mongo - user id
        ref: 'user',
        unique: true,
    }],
    awardsAreSecret: Boolean,
    awards: {
        any: [ClassAwardsSchema],
        warrior: [ClassAwardsSchema],
        rogue: [ClassAwardsSchema],
        mage: [ClassAwardsSchema],
        cleric: [ClassAwardsSchema],
    },
    // awards: [{
    //     class: String, //if undefined -> award is overall
    //     itemModel: {
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: 'itemModel'
    //     }   
    // }]
},
{
    timestamps: true
})

MissionSchema.pre('remove', async function (next){
    const mission = this
    await MissionInstance.deleteMany({mission: mission._id})
    next()
})

export const Mission = new mongoose.model('mission', MissionSchema)
