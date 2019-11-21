import mongoose from 'mongoose'
import validator from 'validator'
import {ClassAwardsSchema} from '../schemas/ClassAwardsSchema'

export const eventStatuses = ['ready', 'active', 'running', 'archive']

export const RallySchema = new mongoose.Schema({

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
    startDate: {
        type: Date
    },
    expiryDate: { //counted from time length (days, hours, minutes, seconds) passed by admin?
        type: Date
    },
    imgSrc: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    users: [{
        experience: Number,
        profile: { //users active in rally
            type: mongoose.Schema.Types.ObjectId, //id in mongo - user id
            ref: 'user',
            unique: true,
        }
    }],
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
    awardsAreSecret: Boolean,
    awardsLevels: [{
        awardsLevel: {
            level: {
                type: Number,
                min: 1,
                validate(value) {
                    if (!validator.isInteger(value)) {
                        throw new Error(`${value} is not an integer value!`)
                    }
                },
                unique: true,
            },
            awards: {
                any: [ClassAwardsSchema],
                warrior: [ClassAwardsSchema],
                rogue: [ClassAwardsSchema],
                mage: [ClassAwardsSchema],
                cleric: [ClassAwardsSchema],
            }   
        },
    }],
        
},
{
    timestamps: true
})


export const Rally = new mongoose.model('rally', RallySchema)
