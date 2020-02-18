import mongoose from 'mongoose'

export const productCategories = ['shots', 'drinks', 'beers', 'food', 'alco-free']

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
    },
    awards: [{   
        quantity: Number,
        itemModel: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'itemModel'
        }  
    }]

})


ProductSchema.pre('remove', async function(next){
    const product = this


    await ItemModel.updateMany(
        {perks: { $elemMatch: {'target.disc-product': product._id}}}, 
        {$pull: {
            perks: {'target.disc-product': product._id}
        }}
    )

    next()
})

export const Product = new mongoose.model('product', ProductSchema)

