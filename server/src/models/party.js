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

PartySchema.statics.validateInShopStatus = (userId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        const party = await Party.findOne({ leader: userId }); //only if leader going to be disconnected

        if (party && party.inShop !== newStatus) {
            party.inShop = newStatus;
            await party.save();
            return resolve(true);
        }
        resolve(false);
    });
}

PartySchema.statics.clear = async () => {
    const parties = await Party.find({})
    await asyncForEach((parties), async party => {
      await party.remove() //to start pre remove middleware
    })
}

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