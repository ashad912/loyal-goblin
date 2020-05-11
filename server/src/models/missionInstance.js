import mongoose from 'mongoose'
import {User} from './user'
import arrayUniquePlugin from 'mongoose-unique-array'
import {asyncForEach} from '@utils/methods'
import { MissionInstanceExpiredEvent } from './missionInstanceExpiredEvent'
import isEqual from 'lodash/isEqual'
import missionStore from '@store/mission.store.js'

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


}, {timestamps: true})

MissionInstanceSchema.methods.partyCompare = function (party, checkPresence){
  let missionParty = [] 
  this.party.forEach((memberObject) => {
      const memberId = memberObject.profile
      missionParty = [...missionParty, memberId]
      if(checkPresence){
        if(memberId.toString() === user._id.toString() && memberObject.inInstance === false){
          throw Error('User is not in the mission instance!')
      }
      }
  })

  if(!isEqual(missionParty, party)) {
      throw Error('Invalid party!')
  }
}

MissionInstanceSchema.statics.toggleUserStatus = (user, update) => {
  return new Promise( async (resolve, reject) => {
    try{
        await user.populate({
            path: 'activeMission'
        }).execPopulate()

        const missionTime = missionStore.instanceValidTimeInMins * missionStore.timeIntUnit * 1000
        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission, createdAt: {$gte: new Date(new Date().getTime()-missionTime) }})

        if(!missionInstance){
            throw Error('There is no such mission instance!')
        }
        
        const index = missionInstance.party.findIndex(member => member.profile.toString() === user._id.toString())

        if(index < 0){
            throw Error('You are not in this mission!')
        }

        for(const key in update){   
          if(missionInstance.toObject().party[index].hasOwnProperty(key)){ //toObject - access to hasOwnProp
            missionInstance.party[index][key] = update[key]
          }
        }

        await missionInstance.save()

        resolve(missionInstance)
    }catch(e){
        reject(e)
    }
    
})
}

MissionInstanceSchema.statics.removeIfExists = (userId) => {
    return new Promise (async (resolve, reject)=> {
        try{
          const missionInstance = await MissionInstance.findOne(
            {party: {$elemMatch: {profile: userId}}}    
          )
          
          if(missionInstance){
            await missionInstance.remove()
            return resolve(true)
          }
          
          resolve(false)
        }catch(e){
          reject(e)
        }
      })
}


MissionInstanceSchema.statics.validateInStatus = (userId, newStatus, secondNewStatus) => {
    return new Promise(async (resolve, reject) => {
        const missionInstance = await MissionInstance.findOne({
          party: { $elemMatch: { profile: userId } }
        });
    
        if (missionInstance) {
          const index = missionInstance.party.findIndex(
            user => user.profile.toString() === userId
          );
    
          if (index > -1) {
            if (missionInstance.party[index].inMission !== newStatus) {
              missionInstance.party[index].inMission = newStatus;
              if(secondNewStatus){
                missionInstance.party[index].readyStatus = secondNewStatus
              }
              await missionInstance.save();
              return resolve(true);
            }
          }
        }
        resolve(false);
      });
}


MissionInstanceSchema.statics.clear = async () => {
    const missionInstances = await MissionInstance.find({})
    await asyncForEach(missionInstances, async (missionInstance) => {
      await missionInstance.remove()
    })
}

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