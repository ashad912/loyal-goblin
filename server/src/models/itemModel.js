import mongoose from 'mongoose'


export const itemModelTypes = ['amulet', 'weapon', 'breastplate', 'leggins', 'shoes', 'helmet']


const ItemModelSchema = new mongoose.Schema({ //class of Item

    type: {
        type: String,
        required: true,
    }, //CONSIDER: type as ItemType with separate schema and model
    name: {
        type: String,
        required: true, 
    },
    //perks - to specify what kind of perks we have
    //requiredLvl
    //description
    imgSrc: {
        type: String,
        required: true,
    }
})

export const ItemModel = new mongoose.model('itemModel', ItemModelSchema)