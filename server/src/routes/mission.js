import express from 'express'
import moment from 'moment'

import { auth } from '@middleware/auth';
import { adminAuth } from '@middleware/adminAuth';

import { User } from '@models/user';
import { Mission } from '@models/mission';
import { MissionInstance } from '@models/missionInstance';
import { MissionInstanceExpiredEvent } from '@models/missionInstanceExpiredEvent';
import { Item } from '@models/item'
import { ItemModel } from '@models/itemModel'
import { Rally } from '@models/rally'
import { Party } from '@models/party';

import missionStore from '@store/mission.store.js'

import {
    asyncForEach,
    designateExperienceMods,
    savePNGImage,
    removeImage,
    updateAmuletCounters,
    getEndpointError
} from '@utils/functions'
import { ERROR, INFO, WARN } from '@utils/constants'


const router = new express.Router


////ADMIN-SIDE


//OK
router.get('/events', adminAuth, async (req, res, next) => {
    try {
        const missionList = await Mission
            .find({})
            .populate({ path: 'amulets.itemModel awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel' })
        const rallyList = await Rally
            .find({})
            .populate({ path: 'awardsLevels.awards.any.itemModel awardsLevels.awards.warrior.itemModel awardsLevels.awards.rogue.itemModel awardsLevels.awards.mage.itemModel awardsLevels.awards.cleric.itemModel' })

        const eventList = [...missionList, ...rallyList]
        res.send(eventList)
    } catch (e) {
        next(e)
    }

})

//OK
router.post('/create', adminAuth, async (req, res, next) => {

    const mission = new Mission(req.body)

    try {
        await mission.save()
        res.status(201).send(mission._id)
    } catch (e) {
        next(e)
    }
})

//OK
router.delete('/remove', adminAuth, async (req, res, next) => {
    try {
        const mission = await Mission.findOne({ _id: req.body._id })

        if (!mission) {
            throw getEndpointError(WARN, 'Mission does not exist', null, 404)
        }

        await removeImage(missionStore.uploadPath, mission.imgSrc)

        await mission.remove()

        res.sendStatus(200)
    } catch (e) {
        next(e)
    }
})


router.patch('/uploadIcon/:id', adminAuth, async (req, res, next) => {
    try {
        if (!req.files) {
            throw getEndpointError(WARN, 'No mission icon provided')
        }

        const mission = await Mission.findById(req.params.id)
        if (!mission) {
            throw getEndpointError(WARN, 'Mission does not exist', null, 404)
        }

        if (req.files.icon) {
            let icon = req.files.icon.data
            const imgSrc = await savePNGImage(icon, mission._id, missionStore.uploadPath, mission.imgSrc)
            mission.imgSrc = imgSrc
        }

        await mission.save()

        res.status(200).send()
    } catch (e) {
        next(e)
    }

})

//OK
router.patch("/update", adminAuth, async (req, res, next) => {

    let updates = Object.keys(req.body);
    const id = req.body._id

    try {
        updates = updates.filter((update) => {
            return update !== '_id' || update !== "imgSrc"
        })

        const forbiddenUpdates = [""];

        const isValidOperation = updates.every(update => {
            return !forbiddenUpdates.includes(update);
        });

        if (!isValidOperation) {
            throw getEndpointError(WARN, 'Invalid update')
        }

    
        const mission = await Mission.findById(id)

        if (!mission) {
            throw getEndpointError(WARN, 'Mission does not exist', null, 404)
        }

        updates.forEach(update => {
            mission[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
        });

        await mission.save();

        res.send(mission._id);
    } catch (e) {
        next(e)
    }
});

//OK
//completedByUsers is cleared by 'copy' request
router.post("/copy", adminAuth, async (req, res, next) => {


    try {
        const copiedMission = await Mission.findById(req.body._id)
        const copiedMissionObject = copiedMission.toJSON()

        delete copiedMissionObject._id
        copiedMissionObject.completedByUsers = []

        const mission = new Mission(copiedMissionObject)

        mission.title = req.body.title
        mission.activationDate = req.body.activationDate
        mission.expiryDate = req.body.expiryDate

        await mission.save();

        res.send(mission);
    } catch (e) {
        next(e)
    }
});

//OK
router.patch("/publish", adminAuth, async (req, res, next) => {


    try {
        const mission = await Mission.findById(req.body._id)

        mission.activationDate = moment().toISOString()

        await mission.save();

        res.send(mission);
    } catch (e) {
        next(e)
    }
});


////USER-SIDE


//OK
//assumed, when user finishes the mission, mission saves his id in array
router.get('/list', auth, async (req, res, next) => { //get active missions which are available for specific user AND for all user's party!!

    const user = req.user;

    try {
        //CONSIDER: move populate to middleware Mission.post('find', ...)
        // const missions = await Mission.find({completedByUsers:  {$elemMatch: {$nin: partyIds}}})
        //     .populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
        //         path: 'amulets.itemModel',
        //         options: {}
        //     })

        let partyIds = [user._id]

        const missionInstance = await MissionInstance.findOne(
            { party: { $elemMatch: { profile: user._id } } }
        )

        //if missionInstance expired
        if (missionInstance && moment.utc().valueOf() >= moment.utc(missionInstance.createdAt).add(missionStore.instanceValidTimeInMins, missionStore.timeUnit).valueOf()) {
            await missionInstance.remove()
        } else if (missionInstance) {
            const mission = await Mission
                .aggregate()
                .match({ _id: missionInstance.mission }) //return only one mission - of which the user is a participant (as array for compatibility)
                .project(missionStore.missionListProjection)

            await ItemModel.missionPopulate(mission)

            // await ItemModel.populate(mission, { //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
            //     path: 'amulets.itemModel awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel',
            //     populate: { path: "perks.target.disc-product", select: '_id name' },
            //     options: {}
            // })

            res.send({ missions: mission, missionInstanceId: missionInstance.mission }) //return only one mission - of which the user is a participant (as array for compatibility)
            return
        }

        const party = await Party.findById(user.party)

        if (user.party && !party) {
            throw getEndpointError(WARN, 'Party ref error', user._id)
        }

        if (party) {
            //swap user id by leader id -> fetching user does not have to be leader!
            partyIds = [party.leader, ...party.members]
        }



        //console.log(partyIds)

        //console.log( new Date().toUTCString())
        let missions = await Mission
            .aggregate()
            .match({
                $and: [
                    { activationDate: { $lte: new Date() } },
                    { expiryDate: { $gte: new Date() } },
                    {
                        completedByUsers:
                        {
                            $not: //true inverts to false; to get this mission ALL elements do not have to include any element from 'party' 
                            {
                                $elemMatch: //elemMatch works as 'or' - false, false, false, true => true
                                    { $in: partyIds } //if even one of completedByUsers elements includes some element from 'party' -> true
                            }
                        }
                    },
                    {
                        $or: [ //excluding unique missions finished by at least one user
                            { unique: false },
                            { completedByUsers: { $size: 0 } }
                        ]
                    }
                ],
            })
            .project(missionStore.missionListProjection)

        //excluding unique missions which instances exist
        let excludedMissions = []
        await asyncForEach(missions, async (mission) => {
            if (mission.unique) {
                const instances = await MissionInstance.find({ mission: mission._id })
                if (instances.length) {
                    excludedMissions = [...excludedMissions, mission._id.toString()]
                }
            }
        })

        missions = missions.filter((mission) => {
            return !excludedMissions.includes(mission._id.toString())
        })

        //custom sorting for specific user
        const getMinLevelUser = (party) => {
            return new Promise(async (resolve, reject) => {
                try {
                    await party.populate({
                        path: 'leader members',
                        select: "_id experience"
                    }).execPopulate()

                    // const membersExp = party.members.map((member) => member.experience)
                    // const partyExp = [party.leader.experience, ...membersExp]
                    // resolve(Math.min(...partyExp))

                    const partyArray = [party.leader, ...party.members]
                    partyArray.sort((a, b) => a.experience < b.experience)
                    resolve(partyArray[0])
                } catch (e) {
                    reject(e)
                }
            })
        }



        const level = party ? (await getMinLevelUser(party)).getLevel() : user.getLevel();

        missions.sort((a, b) => {
            return Math.abs(level - a.level) - Math.abs(level - b.level);
        });

        await ItemModel.missionPopulate(missions)

        //population on all colection saved to missions var
        // await ItemModel.populate(missions, { //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
        //     path: 'amulets.itemModel awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel',
        //     populate: { path: "perks.target.disc-product", select: '_id name' },
        //     options: {}
        // })

        //IMPORTANT: .execPopulate() does not work on collection!!!!!! lost 1,5 hour on this xd
        /*missions.forEach( async (mission) => {
            console.log(mission)
            await mission.populate({ 
                path: 'amulets.itemModel'
            }).execPopulate()
        })*/

        //console.log(missions)

        res.send({ missions, missionInstanceId: null })
    } catch (e) { 
        next(e)
    }
})

//OK
//get user's amulets available for specific mission
router.get('/amulets', auth, async (req, res, next) => {
    const user = req.user

    try {
        await user.populate({
            path: 'activeMission'
        }).populate({
            path: 'bag'
        }).populate({
            path: 'bag.itemModel',
            populate: { path: "perks.target.disc-product", select: '_id name' },
        }).execPopulate()


        const missionInstance = await MissionInstance.findOne({ _id: user.activeMission }).populate({
            path: 'mission'
        })

        if (!missionInstance) {
            throw getEndpointError(WARN, 'There is no such mission instance', user._id, 404)
        }

        missionInstance.partyCompare([user.party.leader, ...user.party.members], null)

        //amulets used in mission
        const missionAmulets = missionInstance.mission.amulets.map((amulet) => {
            return amulet.itemModel.toString()
        })

        //available amulets to use for user
        const amulets = user.bag.filter((item) => {
            return missionAmulets.includes(item.itemModel._id.toString())
        })

        res.send(amulets) //return populated amulets
    } catch (e) {
        next(e)
    }
})



//OK
router.post('/createInstance', auth, async (req, res, next) => { //mission id passed from frontend
    const user = req.user



    try {
        //if user.party get Party
        let membersIds = []
        let leaderId = null

        if (user.party) {
            const party = await user.validatePartyAndLeader(false)
            membersIds = [...party.members]
            leaderId = party.leader
        } else {
            leaderId = user._id
        }

        if (leaderId && (leaderId.toString() !== user._id.toString())) { //here are objectIDs - need to be string
            throw getEndpointError(WARN, 'User is not the leader', user._id)
        }

        const mission = await Mission.findOne({
            $and: [
                { _id: req.body._id },
                { activationDate: { $lte: new Date() } },
                { expiryDate: { $gte: new Date() } },
                {
                    completedByUsers:
                    {
                        $not: //true inverts to false; to get this mission ALL elements do not have to include any element from 'party' 
                        {
                            $elemMatch: //elemMatch works as 'or' - false, false, false, true => true
                                { $in: [...membersIds, leaderId] } //if even one of completedByUsers elements includes some element from 'party' -> true
                        }
                    }

                },
                {
                    $or: [ //excluding unique missions finished by at least one user
                        { unique: false },
                        { completedByUsers: { $size: 0 } }
                    ]
                }

            ]
        })

        if (!mission) {
            throw getEndpointError(WARN, 'There is no such mission', user._id, 404)
        }

        if (mission.unique) {
            const instances = await MissionInstance.find({ mission: mission._id })
            if (instances.length) {
                throw getEndpointError(WARN, 'It is unique mission, which instance exists', user._id)
            }
        }

        if (membersIds.length + 1 > mission.maxPlayers || membersIds.length + 1 < mission.minPlayers) { //+1 - for leader
            throw getEndpointError(WARN, 'Unappropriate party size', user._id)
        }

        await user.updatePerks(false, true);

        let party = [user]
        let totalStrength = user.attributes.strength + user.userPerks.attrStrength
        let totalDexterity = user.attributes.dexterity + user.userPerks.attrDexterity
        let totalMagic = user.attributes.magic + user.userPerks.attrMagic
        let totalEndurance = user.attributes.endurance + user.userPerks.attrEndurance
        let minUserLevelInParty = user.getLevel()



        await asyncForEach(membersIds, async (memberId) => {
            const member = await User.findById(memberId)

            if (!member) {
                throw getEndpointError(WARN, `Member (${memberId}) does not exist!`, user._id, 404)
            }

            await member.updatePerks(false, true);

            party = [...party, member]
            totalStrength += member.attributes.strength + member.userPerks.attrStrength
            totalDexterity += member.attributes.dexterity + member.userPerks.attrDexterity
            totalMagic += member.attributes.magic + member.userPerks.attrMagic
            totalEndurance += member.attributes.endurance + member.userPerks.attrEndurance
            minUserLevelInParty = Math.min(member.getLevel(), minUserLevelInParty)
        })

        //console.log('got all party', party.map((member) => member._id))


        if (totalStrength < mission.strength) {
            throw getEndpointError(WARN, `Total party strength is too low!`, user._id)
        }
        if (totalDexterity < mission.dexterity) {
            throw getEndpointError(WARN, `Total party dexterity is too low!`, user._id)
        }
        if (totalMagic < mission.magic) {
            throw getEndpointError(WARN, `Total party magic is too low!`, user._id)
        }
        if (totalEndurance < mission.endurance) {
            throw getEndpointError(WARN, `Total party endurance is too low!`, user._id)
        }
        if (minUserLevelInParty < mission.level) {
            throw getEndpointError(WARN, `Party level is too low!`, user._id)
        }

        await asyncForEach(party, async (member) => {
            await member.populate({ //looking for user's id in mission instances 
                path: 'activeMission'
            }).execPopulate()

            //activeMission is recognized as an array due to virtualization

            //console.log('got activeMission field for ', member._id, member.activeMission)

            if (member.activeMission.length) {
                throw getEndpointError(WARN, `Member (${member._id}) is in another mission!`, user._id)
            }

        })

        //Remove leader active order
        if (user.activeOrder.length) await user.clearActiveOrder()

        let partyIds = [leaderId, ...membersIds]

        let partyObject = []
        partyIds.forEach((memberId) => {
            const memberObject = { inMission: false, readyStatus: false, profile: memberId }
            partyObject = [...partyObject, memberObject]
        })

        const missionInstance = new MissionInstance({ mission: mission._id, party: partyObject, items: [] })
        const mI = await missionInstance.save()

        if (process.env.REPLICA === "true") {
            await MissionInstanceExpiredEvent.create({ _id: mI._id })
        }


        //LEGACY NOREPLICA
        if (process.env.REPLICA === "false") {
            setTimeout(async () => {
                try {
                    const instance = await MissionInstance.findById(missionInstance._id)
                    if (instance) {
                        await instance.remove()
                    }
                } catch (e) {
                    console.log(e.message)
                }
            }, 30 * 60 * 1000) //30 mins
        }

        res.status(200).send({ missionInstance, imgSrc: mission.imgSrc })

    } catch (e) {
        next(e)
    }

})
//OK
router.delete('/deleteInstance', auth, async (req, res, next) => {
    const user = req.user

    try {


        let leader = null

        if (user.party) {
            const party = await user.validatePartyAndLeader()
            leader = party.leader
        } else {
            leader = user._id
        }

        if (leader && (leader.toString() !== user._id.toString())) { //here are objectIDs - need to be string
            throw getEndpointError(WARN, `User is not the leader`, user._id)
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()


        const missionInstance = await MissionInstance.findOne({ _id: user.activeMission })

        if (!missionInstance) {
            throw getEndpointError(WARN, 'There is no such mission instance', user._id, 404)
        }

        await missionInstance.remove() //remove middleware trigger method returning instance items to owner bags

        res.send()
    } catch (e) {
        next(e)
    }
})

//OK
router.patch('/leaveInstance', auth, async (req, res, next) => {
    const user = req.user

    try {
        const missionInstance = await MissionInstance.toggleUserStatus(user, { inMission: false, readyStatus: false })

        res.send(missionInstance)

    } catch (e) {
        next(e)
    }
})
//OK
router.patch('/enterInstance', auth, async (req, res, next) => {
    const user = req.user
    const socketConnectionStatus = req.body.socketConnectionStatus

    try {
        //const missionInstance = await toggleUserInstanceStatus(user, 'inMission', true)
        const missionInstance = await MissionInstance.toggleUserStatus(user, { inMission: true })

        if (socketConnectionStatus !== undefined) {
            if (missionInstance.party.length > 1 && !socketC1onnectionStatus) { //if client of multiplayer mission is not connected to socket
                throw getEndpointError(WARN, `Client is not connected to socket`, user._id)
            }
        }

        await user.populate({
            path: 'bag party',
            populate: { path: 'itemModel', populate: { path: "perks.target.disc-product", select: '_id name' }, }
        }).execPopulate()

        if (user.party) {
            missionInstance.partyCompare([user.party.leader, ...user.party.members], null)
        }

        await missionInstance.populate({
            path: 'mission items party.profile ',
            populate: { path: 'amulets.itemModel itemModel', select: '_id name imgSrc description' }
        }).execPopulate()

        //amulets used in mission
        const missionAmulets = missionInstance.mission.amulets.map((amulet) => {
            return amulet.itemModel._id.toString()
        })

        //console.log(missionAmulets)

        //available amulets to use for user
        const amulets = user.bag.filter((item) => {
            return missionAmulets.includes(item.itemModel._id.toString())
        })



        res.send({ missionInstance, amulets })

    } catch (e) {
        next(e)
    }
})
//OK
router.patch('/ready', auth, async (req, res, next) => {
    const user = req.user

    try {
        const missionInstance = await MissionInstance.toggleUserStatus(user, { readyStatus: true })

        res.send(missionInstance)

    } catch (e) {
        next(e)
    }
})
//OK
router.patch('/notReady', auth, async (req, res, next) => {
    const user = req.user

    try {
        const missionInstance = await MissionInstance.toggleUserStatus(user, { readyStatus: false })
        res.send(missionInstance)

    } catch (e) {
        next(e)
    }
})



//OK
router.delete('/finishInstance', auth, async (req, res, next) => {

    const createAwards = async (user, awards) => {
        let items = []

        await asyncForEach(Object.keys(awards.toJSON()), async (className) => {

            if (user.class === className || className === 'any') {

                await asyncForEach(awards[className], async (item) => {

                    for (let i = 0; i < item.quantity; i++) {
                        const newItem = new Item({ itemModel: item.itemModel, owner: user._id })
                        await newItem.save()
                        items = [...items, newItem._id]
                    }


                })
            }
        })

        return items
    }

    const user = req.user

    try {

        let membersIds = []
        let leader = null

        if (user.party) {
            const party = await Party.findById(user.party)
            membersIds = [...party.members]
            leader = party.leader
        } else {
            leader = user._id
        }

        if (leader && (leader.toString() !== user._id.toString())) { //here are objectIDs - need to be string
            throw getEndpointError(WARN, `User is not the leader`, user._id)
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()


        //finding missionInstance & checkin all user ready statuses
        const missionInstance = await MissionInstance.findOne({
            $and: [
                { _id: user.activeMission },
                {
                    party:
                    {
                        $not: //invert to true
                        {
                            $elemMatch: //if all readyStatuses are true => got false here // even one readyStatus is false -> got true here
                            {
                                readyStatus:
                                    { $ne: true }
                            }
                        }
                    }
                }
            ]
        }).populate({
            path: 'mission'
        }).populate({
            path: 'items', populate: { path: "perks.target.disc-product", select: '_id name' },
        })


        if (!missionInstance) {
            throw getEndpointError(WARN, `No matching mission instance found`, user._id, 404)
        }

        missionInstance.partyCompare([leader, ...membersIds], user._id)


        //check amulets
        const amulets = missionInstance.mission.amulets
        let setQuantity = 0

        for (let index = 0; index < amulets.length; index++) {
            const specificAmuletInstances = missionInstance.items.filter((item) => {
                return item.itemModel._id.toString() === amulets[index].itemModel.toString()
            })

            if (specificAmuletInstances.length !== amulets[index].quantity) {
                throw getEndpointError(WARN, `Amulets (${amulets[index].itemModel}) quantity is invalid!`, user._id)
            }

            setQuantity += amulets[index].quantity
        }

        //verify if there are no additional items
        if (missionInstance.items.length !== setQuantity) {
            throw getEndpointError(WARN, `Total amulets quantity is invalid!`, user._id)
        }


        await asyncForEach(missionInstance.party, async (member) => {

            const user = await User.findById(member.profile).populate({
                path: 'activeMission'
            }) //recoginized as an array

            if (user.activeMission.length && (user.activeMission[0]._id.toString() === missionInstance._id.toString())) {
                const items = await createAwards(user, missionInstance.mission.awards)

                const modMissionExp = designateExperienceMods(missionInstance.mission.experience, user.userPerks.rawExperience)
                const newLevels = user.getNewLevels(modMissionExp)

                const statistics = user.statistics
                statistics.missionCounter += 1
                statistics.amuletCounters = updateAmuletCounters(statistics.amuletCounters, missionInstance.mission.amulets)

                await User.updateOne(
                    { _id: user._id },
                    { $addToSet: { bag: { $each: items } }, $inc: { experience: modMissionExp, levelNotifications: newLevels }, $set: { statistics: statistics } }
                )

                // await Mission.updateOne(
                //     {_id: missionInstance.mission._id},
                //     { $addToSet: { completedByUsers: user._id }}
                // )

            }

        })


        await asyncForEach(missionInstance.items, async (itemId) => {
            const item = await Item.findById(itemId)
            await item.remove() //pre removing middleware (item) clear missionInstance items array!
        })

        await missionInstance.populate({
            path: 'mission',
            populate: { path: 'awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel', populate: { path: "perks.target.disc-product", select: '_id name' }, }
        }).execPopulate()

        await missionInstance.remove() //remove middleware trigger method returning instance items to owner bags (in this case instance items array is empty)

        res.send(missionInstance.mission.awards)
    } catch (e) {
        next(e)
    }
})

const verifySendItem = (user, missionInstance, itemId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!missionInstance) {
                throw getEndpointError(WARN, 'There is no such mission instance', user._id, 404)
            }

            let membersIds = []
            let leader = null

            if (user.party) {
                const party = await Party.findById(user.party)
                membersIds = [...party.members]
                leader = party.leader
            } else {
                leader = user._id
            }

            missionInstance.partyCompare([leader, ...membersIds], user._id)
            // const party = [leader, ...membersIds]

            // let missionParty = [] 
            // await asyncForEach(missionInstance.party, async (memberObject) => {
            //     const memberId = memberObject.profile
            //     missionParty = [...missionParty, memberId]
            //     if(memberId.toString() === user._id.toString() && memberObject.inInstance === false){
            //         throw Error('User is not in the mission instance!')
            //     }
            // })

            // if(!isEqual(missionParty, party)) {
            //     throw Error('Invalid party!')
            // }


            const item = await Item.findOne({ _id: itemId }).populate({
                path: 'itemModel',
            }).populate({
                path: 'owner'
            })


            if (item.itemModel.type !== 'amulet') {
                throw getEndpointError(WARN, 'Item has not amulet type', user._id)
            }

            if (item.owner._id.toString() !== user._id.toString()) {
                throw getEndpointError(WARN, 'Owner field conflict', user._id)
            }

            resolve()
        } catch (e) {
            reject(e)
        }

    })
}


//OK
router.patch('/sendItem/mission', auth, async (req, res, next) => {
    const user = req.user
    const itemId = req.body.item

    try {
        if (!user.bag.includes(itemId)) {
            throw getEndpointError(WARN, 'No such item in bag', user._id)
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()

        const missionInstance = await MissionInstance.findOne({ _id: user.activeMission })

        await verifySendItem(user, missionInstance, itemId)

        await MissionInstance.updateOne(
            { _id: missionInstance._id },
            { $addToSet: { items: itemId } }
        )
        // missionInstance.items = [...missionInstance.items, itemId]
        // await missionInstance.save()
        //console.log('item added to mission')


        user.bag = user.bag.filter((item) => {
            return item.toString() !== itemId
        })
        await user.save()
        //console.log('item deleted from user bag - item still has owner prop')


        res.status(200).send({ user, missionInstance })
    } catch (e) {
        next(e)
    }


})

//OK - UPDATE CHECK
router.patch('/sendItem/user', auth, async (req, res, next) => {
    const user = req.user
    const itemId = req.body.item

    try {
        await user.populate({
            path: 'activeMission'
        }).execPopulate()

        const missionInstance = await MissionInstance.findOne({ _id: user.activeMission })

        await verifySendItem(user, missionInstance, itemId)

        if (!missionInstance.items.includes(itemId)) {
            throw getEndpointError(WARN, 'No such item in items array', user._id)
        }

        await User.updateOne(
            { _id: user._id },
            { $addToSet: { bag: itemId } }
        )

        // user.bag = [...user.bag, itemId]
        // await user.save()
        //console.log('item added to user')


        missionInstance.items = missionInstance.items.filter((item) => {
            return item.toString() !== itemId
        })
        await missionInstance.save()
        //console.log('item deleted from missionInstance items')


        res.status(200).send({ user })
    } catch (e) {
        next(e)
    }
})


export const missionRouter = router