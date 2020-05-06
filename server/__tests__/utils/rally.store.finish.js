import mongoose from 'mongoose'
import moment from 'moment'
import {User} from '@models/user'
import {ItemModel} from '@models/itemModel'
import {Item} from '@models/item'
import {Rally} from '@models/rally'

const setupFinish = async () => {
    await Rally.deleteMany({})
    await User.deleteMany({})
    await ItemModel.deleteMany({})
    await Item.deleteMany({})

    await User.insertMany(users)
    await ItemModel.insertMany(itemModels)
    const usersIds = users.map(user => user._id.toString())
    const itemModelsIds = itemModels.map(itemModel => itemModel._id.toString())
    const rally = getRally(usersIds, itemModelsIds)
    return await new Rally(rally).save()

}

const users = [
    { 
        _id: new mongoose.Types.ObjectId(), 
        "name": "user1",
        "email": "user1@test.com",
        "password": "usertest",
        "active": true,
        "experience": 0,
        "class": "warrior",
        "bag": [],
        "equipped": {},
        "statistics": {
            "rallyCounter": 0,
            "missionCounter": 0
        },
        "activeOrder":  [],
        "loyal": {}
    },
    { 
        _id: new mongoose.Types.ObjectId(), 
        "name": "admin2",
        "email": "user2@test.com",
        "password": "usertest",
        "active": true,
        "experience": 0,
        "class": "rogue",
        "bag": [],
        "equipped": {},
        "statistics": {
            "rallyCounter": 0,
            "missionCounter": 0
        },
        "activeOrder":  [],
        "loyal": {}
    },
]

const itemModels = [

    {   
        _id: new mongoose.Types.ObjectId(), 
        "type": "head",
        "name": "headitem",
        "description": "itemdesc",
        "imgSrc": "img.png",
        "class": "any",
        "perks": []  
    },

    {   
        _id: new mongoose.Types.ObjectId(), 
        "type": "chest",
        "name": "chestitem",
        "description": "itemdesc",
        "imgSrc": "img.png",
        "class": "warrior",
        "perks": []  
    },

]


const getRally = (usersIds, iModelsIds) => (
    {
        "title" : "RallyTest1",
        "activationDate": moment().subtract(10, 's').toISOString(),
        "startDate": moment().subtract(8, 's').toISOString(),
        "expiryDate": moment().toISOString(),
        "description" : "Super important rally",
        "experience" : 1000,
        "users" : [ 
            {
                "experience" : 998,
                "profile" : usersIds[0]
            },
            {
                "experience" : 1000,
                "profile" : usersIds[1]
            },
            {
                "experience" : 2002,
                "profile" : usersIds[2]
            }
        ],
        "awardsAreSecret" : false,
        "awardsLevels" : [ 
            {
                
                "level" : 1000,
                "awards" : {
                    "any" : [],
                    "warrior" : [ 
                        {
                            "quantity" : 1,
                            "itemModel" : iModelsIds[0]
                        }
                    ],
                    "rogue" : [],
                    "mage" : [],
                    "cleric" : []
                }
            }, 
            {
                
                "level" : 2000,
                "awards" : {
                    "any" : [],
                    "warrior" : [],
                    "rogue" : [ 
                        {
                            "quantity" : 2,
                            "itemModel" : iModelsIds[1]
                        }
                    ],
                    "mage" : [],
                    "cleric" : []
                }
            }
        ]
    }   
)




export default setupFinish
