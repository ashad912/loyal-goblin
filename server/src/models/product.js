import mongoose from 'mongoose'

export const productsCategory = ['shots', 'drinks', 'beer', 'food', 'alco-free']

const ProductSchema = new mongoose.Schema({ //instance of ItemModel

    name: {
        type: String,
        required: true,
    }, 
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    imgSrc: {
        type: String,
    }

})


export const Product = new mongoose.model('product', ProductSchema)