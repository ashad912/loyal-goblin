import mongoose from 'mongoose'
import {EventSchema} from './event'
import {UserSchema} from './user'
import arrayUniquePlugin from 'mongoose-unique-array'

const EventInstanceSchema = new mongoose.Schema({ //instance of ItemModel

    //event instance is existing through small period - easier to keep full objects? NO
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'event',
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

EventInstanceSchema.plugin(arrayUniquePlugin);

export const EventInstance = new mongoose.model('eventInstance', EventInstanceSchema)