import mongoose from 'mongoose'
import {User} from './user'
import {ScheduledWithinSchema} from '../schemas/ScheduledWithinSchema'


const OrderExpiredEventSchema = new mongoose.Schema({...ScheduledWithinSchema.obj}, {timestamps: true})

OrderExpiredEventSchema.index({createdAt: 1}, {expireAfterSeconds: 300});

export const OrderExpiredEvent = new mongoose.model('orderExpiredEvent', OrderExpiredEventSchema)

export const registerOrderWatch = () => {
    let deleteOps = {
        $match: {
            operationType: "delete" 
        }
    };
    
    
    
    OrderExpiredEvent.watch([deleteOps]).
        on('change', async data => {
            console.log(new Date(), data.documentKey._id, 'order remove event triggered');
            const user = await User.findOne({_id: data.documentKey._id, activeOrder: { $not: { $size: 0 } } })
            if(user){
                await user.clearActiveOrder()
                
                console.log(new Date(), user._id, 'user.activeOrder auto-removed')
            }
        });
}