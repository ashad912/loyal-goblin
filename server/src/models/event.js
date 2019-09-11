import mongoose from 'mongoose'


export const eventTypes = ['rally', 'mission']

export const eventStatuses = ['ready', 'active', 'archive']


const EventSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
    },
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
    expiryDate: {
        type: Date
    },
    avatarSrc: String,
    requiredPlayers: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unique: Boolean, //active only once
    amulets: [{
        amulet: {
            quantity: Number,
            itemModel: { //for fixation: https://stackoverflow.com/questions/48501410/mongoose-how-to-get-an-object-instead-of-an-object-reference-in-a-getter
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'itemModel'
            }
        }
    }],
    users: [{ //user whoes have finished the events - to query available events for specific user -> for users statistics used virtualization by user side
        user: {
            type: mongoose.Schema.Types.ObjectId, //id in mongo - user id
            ref: 'user' //name of model!!
        }
    }]
    //nagrody - pointy,  
    //wymagania - atrybuty
    //Statki jak dokładnie
    //Misja jak graczowo
    //Misja nagrody jak dzielone
    //Atrybuty - cztery

},
{
    timestamps: true
})

export const Event = new mongoose.model('event', EventSchema)
