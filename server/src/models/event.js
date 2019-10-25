import mongoose from 'mongoose'
import validator from 'validator'

export const eventTypes = ['rally', 'mission']

export const eventStatuses = ['ready', 'active', 'archive', 'ended']


export const EventSchema = new mongoose.Schema({

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
    expiryDate: { //counted from time length (days, hours, minutes, seconds) passed by admin?
        type: Date
    },
    imgSrc: {
        type: String
    },
    minPlayers: {
        type: Number,
        required: true,
    },
    maxPlayers: {
        type: Number,
        required: true,
    },
    strength: {
        type: Number,
        required: true,
    },
    dexternity: {
        type: Number,
        required: true,
    },
    magic: {
        type: Number,
        required: true,
    },
    endurance: {
        type: Number,
        required: true,
    },
    level: {
        type: Number,
        min: 1,
        validate(value) {
            if (!validator.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        }
    },
    description: {
        type: String,
        required: true,
    },
    challenge: {
        type: String,
    },
    unique: Boolean, //active only once
    amulets: [{   
        quantity: Number,
        itemModel: { //for fixation: https://stackoverflow.com/questions/48501410/mongoose-how-to-get-an-object-instead-of-an-object-reference-in-a-getter
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'itemModel'
        }  
    }],
    users: [{ //user whoes have finished the events - to query available events for specific user -> for users statistics used virtualization by user side
        type: mongoose.Schema.Types.ObjectId, //id in mongo - user id
        ref: 'user',
    }],
    awards: [{
        class: String, //if undefined -> award is overall
        itemModel: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'itemModel'
        }   
    }]


},
{
    timestamps: true
})

    //nagrody - exp i przedmioty
    //wymagania - atrybuty - siła, magia, zręczność, wytrzymałość - 4
    //klasy - wojownik, mag, łotrzyk, kleryk? - 4
    //Statki jak dokładnie - najprościej
    //Misja jak graczowo - zakres, minimalny lvl
    //Misja nagrody jak dzielone - nagroda pod klasę, 

    //odświeżanie misji - klonowanie to samo z nowym id

export const Event = new mongoose.model('event', EventSchema)
