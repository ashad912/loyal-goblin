import mongoose from 'mongoose'
import {MissionSchema} from './mission'
import {UserSchema} from './user'
import arrayUniquePlugin from 'mongoose-unique-array'

const MissionInstanceSchema = new mongoose.Schema({ //instance of ItemModel

    //event instance is existing through small period - easier to keep full objects? NO
    mission: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'mission',
        required: true,
    },
    party: {
        type: [{
            inRoom: Boolean,
            readyStatus: Boolean,
            user: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user',
                unique: true
            }
        }],
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'item',
        unique: true
    }]


})

MissionInstanceSchema.plugin(arrayUniquePlugin);

export const MissionInstance = new mongoose.model('missionInstance', MissionInstanceSchema)