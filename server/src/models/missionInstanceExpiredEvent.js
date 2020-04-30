import mongoose from 'mongoose'
import {MissionInstance} from './missionInstance'
import {ScheduledWithinSchema} from '../schemas/ScheduledWithinSchema'


const MissionInstanceExpiredEventSchema = new mongoose.Schema({...ScheduledWithinSchema.obj}, {timestamps: true})

MissionInstanceExpiredEventSchema.index({createdAt: 1}, {expireAfterSeconds: 1800});


MissionInstanceExpiredEventSchema.statics.registerWatch = () => {
    let deleteOps = {
        $match: {
            operationType: "delete" 
        }
    };
    
    
    
    MissionInstanceExpiredEvent.watch([deleteOps]).
        on('change', async data => {
            console.log(new Date(), data.documentKey._id, 'missionInstance remove event triggered');
            const mInstance = await MissionInstance.findById(data.documentKey)
            if(mInstance){
                await mInstance.remove()
                console.log(new Date(), mInstance._id, 'missionInstance auto-removed')
            }
        });

}


export const MissionInstanceExpiredEvent = new mongoose.model('missionInstanceExpiredEvent', MissionInstanceExpiredEventSchema)



