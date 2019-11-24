import mongoose from 'mongoose'

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


export const Item = new mongoose.model('item', ItemSchema)