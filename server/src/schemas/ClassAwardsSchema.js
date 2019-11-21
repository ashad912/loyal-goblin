import mongoose from 'mongoose'


export const ClassAwardsSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        min: 1,
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error(`${value} is not an integer value!`)
            }
        }
    },
    itemModel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'itemModel'
    }
})