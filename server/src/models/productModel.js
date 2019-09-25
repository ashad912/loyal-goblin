import mongoose from 'mongoose'


export const productModelCategories = ['shot', 'drink', 'alcoholFree', 'food']


const ProductModelSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    }, 
    name: {
        type: String,
        required: true, 
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    imgSrc: {
        type: String,
        required: true,
    }
})

export const ProductModel = new mongoose.model('productModel', ProductModelSchema)