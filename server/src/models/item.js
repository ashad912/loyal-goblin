import mongoose from 'mongoose'
import { asyncForEach } from '../utils/methods'
import {User} from './user'

const ItemSchema = new mongoose.Schema({ //instance of ItemModel

    model: {
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
    let user = await User.findOne({bag: {$elemMatch: {$eq: item._id}}})
    console.log('halo user', user)
    if(user){
        user.bag = user.bag.filter((bagItem) => {
            return bagItem._id.toString() !== item._id.toString
        })

        await asyncForEach(Object.keys(user.equipped.toJSON()), (category) => {
            if(user.equipped[category].toString() === item._id.toString()){
                user.equipped[category] = null //or remove key?
            }
        })

        await user.save()
    }

    next()

    
})


export const Item = new mongoose.model('item', ItemSchema)