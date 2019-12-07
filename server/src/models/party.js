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

    const allInPartyIds = [party.leader, ...party.members]

    //missionInstance
    const missionInstance = await MissionInstance.findOne({party: {$elemMatch: {user: {$in: allInPartyIds}}}})
    // .populate({
    //     path: "items"
    // })

    if(missionInstance){
        //BELOW IS DONE IN MISSION INSTANCE REMOVE MIDDLEWARE
        // await asyncForEach((missionInstance.items), async item => {
        //     await User.updateOne({_id: item.owner}, {$addToSet: {bag: item._id}})
        // })
        
    
        missionInstance.remove()
    }


    next()   
})


export const Party = new mongoose.model('party', PartySchema)