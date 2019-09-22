import mongoose from 'mongoose'
import {EventSchema} from './event'
import {UserSchema} from './user'

const EventInstanceSchema = new mongoose.Schema({ //instance of ItemModel

    //event instance is existing through small period - easier to keep full objects?
    event: EventSchema,
    party: {
        type: [{
            inRoom: Boolean,
            user: {
                type: UserSchema,
                unique: true
            }
        }],
        required: true
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'item',
            unique: true
        }
    }]


})


export const EventInstance = new mongoose.model('eventInstance', EventInstanceSchema)