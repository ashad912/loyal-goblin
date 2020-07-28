import mongoose from 'mongoose'
import moment from 'moment'
import { ClassAwardsSchema } from '@schemas/ClassAwardsSchema'
import arrayUniquePlugin from 'mongoose-unique-array'
import { getEndpointError } from '@utils/functions'
import { ERROR, WARN, INFO } from '@utils/constants'


export const eventStatuses = ['ready', 'active', 'running', 'archive']

export const RallySchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    imgSrc: {
        type: String
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    }],
    experience: {
        type: Number,
        min: 0,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        },
        required: true,
    },
    awardsAreSecret: Boolean,
    awardsLevels: [{
        level: {
            type: Number,
            min: 0,
            validate(value) {
                if (!Number.isInteger(value)) {
                    throw new Error(`${value} is not an integer value!`)
                }
            },
            // unique: true,
        },
        awards: {
            any: [ClassAwardsSchema],
            warrior: [ClassAwardsSchema],
            rogue: [ClassAwardsSchema],
            mage: [ClassAwardsSchema],
            cleric: [ClassAwardsSchema],
        }
    }],

},
    {
        timestamps: true
    })

RallySchema.methods.conflictCheck = async function () {
    const rally = this

    const newRallyActivation = moment(rally.activationDate).valueOf()
    const newRallyStart = moment(rally.startDate).valueOf()
    const newRallyExpiry = moment(rally.expiryDate).valueOf()

    if (newRallyActivation > newRallyExpiry || newRallyStart > newRallyExpiry) {
        throw getEndpointError(ERROR, 'Invalid dates order')
    }

    const rallyList = await Rally.find({})

    let causingRallyList = [];

    rallyList.forEach(rallyItem => {

        const existingRallyActiviation = moment(rallyItem.activationDate).valueOf();
        const existingRallyEnd = moment(rallyItem.expiryDate).valueOf();

        if (
            !(
                (existingRallyActiviation < newRallyActivation &&
                    existingRallyEnd < newRallyActivation) ||
                (existingRallyEnd > newRallyExpiry &&
                    existingRallyActiviation > newRallyExpiry)
            )
        ) {


            causingRallyList = [...causingRallyList, rallyItem]; //assembling list of 'bad' rallies :<<
        }

    });

    if (causingRallyList.length > 0) {
        throw getEndpointError(ERROR, 'Colliding dates found')
    }
}


RallySchema.plugin(arrayUniquePlugin)

export const Rally = new mongoose.model('rally', RallySchema)
