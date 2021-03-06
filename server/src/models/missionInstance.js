import mongoose from 'mongoose'
import isEqual from 'lodash/isEqual'
import arrayUniquePlugin from 'mongoose-unique-array'
import { User } from './user'
import { MissionInstanceExpiredEvent } from './missionInstanceExpiredEvent'

import { asyncForEach } from '@utils/functions'
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


}, { timestamps: true })

MissionInstanceSchema.methods.partyCompare = function (party, userId) {
  let missionParty = []
  this.party.forEach((memberObject) => {
    const memberId = memberObject.profile
    missionParty = [...missionParty, memberId]
    if (userId) {
      if (memberId.toString() === userId.toString() && memberObject.inInstance === false) {
        throw getEndpointError(WARN, 'User is not in the mission instance!', userId)
      }
    }
  })

  if (!isEqual(missionParty, party)) {
    throw getEndpointError(WARN, 'Invalid party!', userId)
  }
}

MissionInstanceSchema.statics.toggleUserStatus = (user, update) => {
  return new Promise(async (resolve, reject) => {
    try {
      await user.populate({
        path: 'activeMission'
      }).execPopulate()

      const missionTime = missionStore.instanceValidTimeInMins * missionStore.timeIntUnit * 1000
      const missionInstance = await MissionInstance.findOne({ _id: user.activeMission, createdAt: { $gte: new Date(new Date().getTime() - missionTime) } })

      if (!missionInstance) {
        throw getEndpointError(WARN, 'There is no such mission instance!', user._id)
      }

      const index = missionInstance.party.findIndex(member => member.profile.toString() === user._id.toString())

      if (index < 0) {
        throw getEndpointError(WARN, 'You are not in this mission!', user._id)
      }

      for (const key in update) {
        if (missionInstance.toObject().party[index].hasOwnProperty(key)) { //toObject - access to hasOwnProp
          missionInstance.party[index][key] = update[key]
        }
      }

      await missionInstance.save()

      resolve(missionInstance)
    } catch (e) {
      reject(e)
    }

  })
}

MissionInstanceSchema.statics.removeIfExists = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const missionInstance = await MissionInstance.findOne(
        { party: { $elemMatch: { profile: userId } } }
      )

      if (missionInstance) {
        await missionInstance.remove()
        return resolve(true)
      }

      resolve(false)
    } catch (e) {
      reject(e)
    }
  })
}


MissionInstanceSchema.statics.validateInStatus = (userId, update) => {
  return new Promise(async (resolve, reject) => {
    const missionInstance = await MissionInstance.findOne({
      party: { $elemMatch: { profile: userId } }
    });

    if (missionInstance) {
      const index = missionInstance.party.findIndex(
        user => user.profile.toString() === userId
      );

      if (index > -1) {
        if (missionInstance.party[index].inMission !== update.inMission) {
          for (const key in update) {
            if (missionInstance.toObject().party[index].hasOwnProperty(key)) { //toObject - access to hasOwnProp
              missionInstance.party[index][key] = update[key]
            }
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

MissionInstanceSchema.pre('remove', async function (next) {
  const missionInstance = this

  await missionInstance.populate({
    path: "items"
  }).execPopulate()

  await asyncForEach((missionInstance.items), async item => {
    await User.updateOne({ _id: item.owner }, { $addToSet: { bag: item._id } })
  })

  next()
})

MissionInstanceSchema.post('remove', async function (next) {
  const missionInstance = this

  const mIEvent = await MissionInstanceExpiredEvent.findById(missionInstance._id)

  if (mIEvent) {
    await mIEvent.remove()
  }
})

export const MissionInstance = new mongoose.model('missionInstance', MissionInstanceSchema)