import mongoose from 'mongoose'
import {Event} from './event'
import {User} from './user'

const EventInstanceSchema = new mongoose.Schema({ //instance of ItemModel

    //event instance is existing through small period - easier to keep full objects?
    event: Event,
    party: {
        type: [{
            user: {
                type: User,
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