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
    minPlayers: {
        type: Number,
        required: true,
    },
    maxPlayers: {
        type: Number,
        required: true,
    },
    level: Number,
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
            ref: 'user',
            unique: true
        }
    }],
    awards: [{
        award: {
            class: String,
            itemModel: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'itemModel'
            }
        }
    }]
    //nagrody - exp i przedmioty
    //wymagania - atrybuty - siła, magia, zręczność, wytrzymałość - 4
    //klasy - wojownik, mag, łotrzyk, kleryk? - 4
    //Statki jak dokładnie - najprościej
    //Misja jak graczowo - zakres, minimalny lvl
    //Misja nagrody jak dzielone - nagroda pod klasę, 

    //odświeżanie misji - klonowanie to samo z nowym id

},
{
    timestamps: true
})

export const Event = new mongoose.model('event', EventSchema)
