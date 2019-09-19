import mongoose from 'mongoose'


export const itemModelTypes = ['amulet', 'weapon', 'chest', 'legs', 'hands', 'feet', 'head', 'ring']


const ItemModelSchema = new mongoose.Schema({ //class of Item

    type: {
        type: String,
        required: true,
    }, //CONSIDER: type as ItemType with separate schema and model
    name: {
        type: String,
        required: true, 
    },
    requiredLevel: {
        type: Number,
    },
    description: {
        type: String,
        required: true
    },
    perks: {
        attributes: {
            strength: {
                type: Number
            },
            dexterity: {
                type: Number
            },
            magic: {
                type: Number
            },
            endurance: {
                type: Number
            }
        },
        special: {
            experienceMultiplier: {
              type: Number  
            },
            discount: {
                type: Number
            }
        }
        //Potrzeba więcej perków - zapytać Krystiana
    },
    imgSrc: {
        type: String,
        required: true,
    }
})

export const ItemModel = new mongoose.model('itemModel', ItemModelSchema)