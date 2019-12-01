import mongoose from 'mongoose'
import { asyncForEach } from '../utils/methods'
import {User} from './user'
import { MissionInstance } from './missionInstance'

const ItemSchema = new mongoose.Schema({ //instance of ItemModel

    itemModel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'itemModel',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true 
    }

})

//OK
ItemSchema.pre('remove', async function (next){
    const item = this

    //THIS CASE NOT TESTED
    
    //Changed elemMatch design to $all
    await MissionInstance.updateOne(
        {items: {$all: item._id}},
        {$pull: {items:{$all: item._id}}}
    )

    
    // .populate({
    //     path: "items"
    // })

    //if(missionInstance){
        // BELOW IS DONE IN MISSION INSTANCE REMOVE MIDDLEWARE
        // await asyncForEach((missionInstance.items), async missionItem => {
        //     if(missionItem._id.toString() !== item._id.toString()){
        //         await User.updateOne({_id: missionItem.owner}, {$addToSet: {bag: missionItem._id}})
        //     } 
        // })

        //missionInstance.remove()
    //}
    //

    //Changed elemMatch design to $all
    let user = await User.findOne({bag: {$all: item._id}})
    //console.log('halo user', user)
    if(user){
        user.bag = user.bag.filter((bagItem) => {
            return bagItem._id.toString() !== item._id.toString()
        })

        await asyncForEach(Object.keys(user.equipped.toJSON()), (category) => {

            if(user.equipped[category] && user.equipped[category].toString() === item._id.toString()){
                console.log(user.equipped[category].toString(), item._id.toString())
                user.equipped[category] = null //or remove key?
            }
        })

        await user.save()
    }

    // ALTERATIVE require specifying all nested equipped fields... can be developed
    // await User.updateOne({
    //     bag: {$elemMatch: {$eq: item._id}}
    // }, {
    //     $pull: {
    //         'bag': {$eq: item._id},
    //         'equipped' ...
    //     }
    // })

    next()

    
})


export const Item = new mongoose.model('item', ItemSchema)