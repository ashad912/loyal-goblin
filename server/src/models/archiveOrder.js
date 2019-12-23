import mongoose from 'mongoose'
import {ProductsOrderSchema} from '../schemas/ProductsOrderSchema'


const ArchiveOrderSchema = new mongoose.Schema({ //instance of ItemModel
    leader: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    users: [{
        profile: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user',
            //unique: true
        },
        experience: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        products: [ProductsOrderSchema]
    }]

},
{
    timestamps: true
})


export const ArchiveOrder = new mongoose.model('achiveOrder', ArchiveOrderSchema)