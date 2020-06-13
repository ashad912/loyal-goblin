import mongoose from 'mongoose'

import logger from '@logger';
import {MissionInstance} from './missionInstance'
import {ScheduledWithinSchema} from '@schemas/ScheduledWithinSchema'


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
            const mInstance = await MissionInstance.findById(data.documentKey)
            if(mInstance){
                await mInstance.remove()
                logger.info(mInstance._id, 'missionInstance auto-removed')
            }
        });

    logger.info('Mission instance watch triggered')
}


export const MissionInstanceExpiredEvent = new mongoose.model('missionInstanceExpiredEvent', MissionInstanceExpiredEventSchema)



