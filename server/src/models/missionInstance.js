import mongoose from 'mongoose'
import {User} from './user'
import arrayUniquePlugin from 'mongoose-unique-array'
import {asyncForEach} from '../utils/methods'
import { MissionInstanceExpiredEvent } from './missionInstanceExpiredEvent'

const MissionInstanceSchema = new mongoose.Schema({ //instance of ItemModel

    //event instance is existing through small period - easier to keep full objects? NO
    mission: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'mission',
        required: true,
    },
    party: {
        type: [{
            inMission: Boolean,
            readyStatus: Boolean,
            profile: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user',
                unique: true //give missionInstance unique!
            }
        }],
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'item',
    }]


})

MissionInstanceSchema.plugin(arrayUniquePlugin);

MissionInstanceSchema.pre('remove', async function(next){
    const missionInstance = this

    await missionInstance.populate({
        path: "items"
    }).execPopulate()

    await asyncForEach((missionInstance.items), async item => {
        await User.updateOne({_id: item.owner}, {$addToSet: {bag: item._id}})
    })
    
    next()
})

MissionInstanceSchema.post('remove', async function(next){
    const missionInstance = this

    const mIEvent = await MissionInstanceExpiredEvent.findById(missionInstance._id)

    if(mIEvent){
        await mIEvent.remove()
    }
})

export const MissionInstance = new mongoose.model('missionInstance', MissionInstanceSchema)