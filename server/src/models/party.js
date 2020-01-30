import mongoose from 'mongoose'

import {User} from './user'
import {MissionInstance} from './missionInstance'



export const PartySchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
    }],
    inShop: {
        type: Boolean,
        default: false,
    }      
  
}, {
    timestamps: true
})


PartySchema.pre('remove', async function (next){
    const party = this

    await User.updateMany(
        {party: party._id},   
        {$set: {
            party: null,
        }}
    )

    const missionInstance = await MissionInstance.findOne({party: {$elemMatch: {profile: {$in: [party.leader, ...party.members]}}}})
    
    if(missionInstance){
        missionInstance.remove()
    }


    next()   
})


export const Party = new mongoose.model('party', PartySchema)