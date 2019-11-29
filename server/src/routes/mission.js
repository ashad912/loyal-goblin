import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user';
import { Mission } from '../models/mission';
import { auth } from '../middleware/auth';
import { MissionInstance } from '../models/missionInstance';
import { Item } from '../models/item'
import { ItemModel } from '../models/itemModel'
import { asyncForEach } from '../utils/methods'

import isEqual from 'lodash/isEqual'
import {Rally} from '../models/rally'
import moment from 'moment';
import { createCipher } from 'crypto';

const router = new express.Router



////ADMIN-SIDE


//CHECK
router.get('/eventList', auth, async (req,res) => {
    try{
        const missionList = await Mission.find({})
        const rallyList = await Rally.find({})
        const eventList = [...missionList, ...rallyList]
    
        if(!eventList.length){
            res.status(404).send()
        }

        res.send(eventList)
    }catch(e){
        res.status(500).send(e.message)
    }

})

//OK
router.post('/create', auth, async (req, res) =>{

    const mission = new Mission(req.body)

    try {
        await mission.save() 
        res.status(201).send(mission)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

//OK
router.delete('/remove', auth, async(req, res) => {
    try {
        const mission = await Mission.findOne({_id: req.body._id})

        if(!mission){
            res.status(404).send()
        }
        
        await mission.remove()

        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//OK
router.patch("/update", auth, async (req, res, next) => {

    let updates = Object.keys(req.body);
    const id = req.body._id


    updates = updates.filter((update) => {
        return update !== '_id'
    })

    const forbiddenUpdates = [""];
  
    const isValidOperation = updates.every(update => {
        return !forbiddenUpdates.includes(update);
    });
  
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }
  
    try {
      const mission = await Mission.findById(id)
  
      updates.forEach(update => {
        mission[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });
  
      await mission.save();

      res.send(mission);
    } catch (e) {
      res.status(500).send(e.message);
    }
});




////USER-SIDE

//TO-DO
// - leaveInstance
// - finishMission

//CHECK:
// - no amulets DONE
// - no party DONE
// - party
//assumed, when user finishes the mission, mission saves his id in array
router.get('/list', auth, async (req, res) => { //get active missions which are available for specific user AND for all user's party!!
    
    const user = req.user;

    let partyIds = []


    if(user.party.members.length) {
        partyIds = [user.party.leader, ...user.party.members]
    }

    console.log(partyIds)
    
    
    try {
        //CONSIDER: move populate to middleware Mission.post('find', ...)
        // const missions = await Mission.find({completedByUsers:  {$elemMatch: {$nin: partyIds}}})
        //     .populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
        //         path: 'amulets.itemModel',
        //         options: {}
        //     })


        
        //console.log( new Date().toUTCString())
        const missions = await Mission.aggregate().match({
             $and: [
                {activationDate: { $lte: new Date() } },
                {expiryDate: { $gte: new Date() } }, 
                {completedByUsers: 
                    {$not: //true inverts to false; to get this mission ALL elements do not have to include any element from 'party' 
                        {$elemMatch: //elemMatch works as 'or' - false, false, false, true => true
                            {$in: partyIds} //if even one of completedByUsers elements includes some element from 'party' -> true
                        }
                    }
                }
            ],
        })
        .project({ 
            'title': 1,
            'description': 1,
            'minPlayers': 1,
            'maxPlayers': 1,
            'level': 1,
            'strength': 1,
            'dexterity': 1,
            'magic': 1,
            'endurance': 1,
            'unique': 1,
            'amulets': 1,
            'awards': {
                $cond: {
                    if: {
                        '$eq': ['$awardsAreSecret', true]
                    },
                    then: {     
                        "any": [],
                        "warrior": [],
                        "rogue": [],
                        "mage": [],
                        "cleric": [],
                    },
                    else: '$awards'
                }
            },
        })
        
        
        //population on all colection saved to missions var
        await ItemModel.populate(missions, { //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
            path: 'amulets.itemModel',
            options: {}
        })
        
        //IMPORTANT: .execPopulate() does not work on array!!!!!! lost 1,5 hour on this xd
        /*missions.forEach( async (mission) => {
            console.log(mission)
            await mission.populate({ 
                path: 'amulets.itemModel'
            }).execPopulate()
        })*/

        //console.log(missions)
        
        res.send(missions)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

const designateUserLevel = (points) => {
    const a = 10;
    const b = 100;
    
    let previousThreshold = 0;
    for (let i=1; i<=100; i++) {
        const bottomThreshold = previousThreshold
        const topThreshold = previousThreshold + (a*(i**2) + b)

        if(points >= bottomThreshold && points < topThreshold){
            return i
        }
        previousThreshold = topThreshold;
    }
}

//OK
router.post('/createInstance', auth, async (req, res) => { //mission id passed from frontend
    const user = req.user
    
    try{

        if(user.party.leader.toString() !== user._id.toString()){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        const membersIds = [...user.party.members]

        console.log('got members ids', membersIds)

        const mission = await Mission.findOne({
            $and: [
                {_id: req.body._id},
                {activationDate: { $lte: new Date() } }, 
                {expiryDate: { $gte: new Date() } }, 
                {completedByUsers: 
                    {$not: //true inverts to false; to get this mission ALL elements do not have to include any element from 'party' 
                        {$elemMatch: //elemMatch works as 'or' - false, false, false, true => true
                            {$in: [...membersIds, user.party.leader]} //if even one of completedByUsers elements includes some element from 'party' -> true
                        }
                    }
                    
                }
                
        ]})

        if(!mission){
            throw new Error('There is no such mission!')
        }

        //SOLO-MISSION
        // if(Object.entries(user.party).length === 0 && user.party.constructor === Object){
        //     throw new Error('No party!')
        // }

        if(membersIds.length + 1 > mission.maxPlayers || membersIds.length + 1 < mission.minPlayers){ //+1 - for leader
            throw new Error('Unappropriate party size!')
        }

        let party = [user]
        let totalStrength = user.attributes.strength
        let totalDexterity = user.attributes.dexterity
        let totalMagic = user.attributes.magic
        let totalEndurance = user.attributes.endurance
        let minUserLevelInParty = designateUserLevel(user.experience)

        await asyncForEach(membersIds, async (memberId) => {
            const member = await User.findById(memberId)

            if(!member){
                throw Error(`Member (${member._id}) does not exist!`)
            }

            console.log('got member', member._id)

            party = [...party, member]
            totalStrength += member.attributes.strength
            totalDexterity += member.attributes.dexterity
            totalMagic += member.attributes.magic
            totalEndurance += member.attributes.endurance
            minUserLevelInParty = Math.min(designateUserLevel(member.experience), minUserLevelInParty)
        })

        console.log('got all party', party.map((member) => member._id))


        if(totalStrength < mission.strength){
            throw Error(`Total party strength is too low!`)
        }
        if(totalDexterity < mission.dexterity){
            throw Error(`Total party dexterity is too low!`)
        }
        if(totalMagic < mission.magic){
            throw Error(`Total party magic is too low!`)
        }
        if(totalEndurance < mission.endurance){
            throw Error(`Total party endurance is too low!`)
        }
        if(minUserLevelInParty < mission.level){
            throw Error(`Party level is too low!`)
        }

        await asyncForEach(party, async (member) => {
            await member.populate({ //looking for user's id in mission instances 
                path: 'activeMission'
            }).execPopulate()

            //activeMission is recognized as an array due to virtualization

            console.log('got activeMission field for ', member._id, member.activeMission)

            if(member.activeMission.length) {
                throw new Error(`Member (${member._id}) is in another mission!`)
            }

        })

        console.log('party is available')

        let partyIds = [user._id, ...membersIds]

        let partyObject = []
        await asyncForEach(partyIds, async (memberId) => {
                const memberObject = {inRoom: false, readyStatus: false, user: memberId}
                partyObject = [...partyObject, memberObject]
        })
        
        const missionInstanceObject = {mission: mission._id, party: partyObject, items: []}

        console.log(missionInstanceObject)
        const missionInstance = new MissionInstance(missionInstanceObject)
        console.log(missionInstance)
        await missionInstance.save()

        res.status(200).send(missionInstance)
  
    } catch (e) {
        //console.log(e.message)
        res.status(400).send(e.message)
    }
    
})

router.delete('/deleteInstance', auth, async (req, res) => {
    const user = req.user

    try{

        if(user.party.leader.toString() !== user._id.toString()){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()


        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})

        if(!missionInstance){
            throw Error('There is no such mission instance!')
        }

        missionInstance.remove() //remove middleware trigger method returning instance items to owner bags

        res.send()
    }catch(e){
        res.status(400).send(e.message)
    }
})

const toggleUserRoomStatus = (user, field, newStatus, secondField, secondNewStatus) => {
    return new Promise( async (resolve, reject) => {
        try{
            await user.populate({
                path: 'activeMission'
            }).execPopulate()
    
            const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})
    
            if(!missionInstance){
                throw Error('There is no such mission instance!')
            }
            
            const index = missionInstance.party.findIndex(member => member.user.toString() === user._id.toString())
    
            if(index < 0){
                throw Error('You are not in this mission!')
            }
    
            missionInstance.party[index][field] = newStatus

            if(secondField){
                missionInstance.party[index][secondField] = secondNewStatus
            }
    
            await missionInstance.save()

            resolve(missionInstance)
        }catch(e){
            reject(e)
        }
        
    })
}
//OK
router.patch('/leaveRoom', auth, async (req, res) => {
    const user = req.user

    try{

        const missionInstance = await toggleUserRoomStatus(user, 'inRoom', false, 'readyStatus', false)
        
        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})
//OK
router.patch('/enterRoom', auth, async (req, res) => {
    const user = req.user

    try{
        const missionInstance = await toggleUserRoomStatus(user, 'inRoom', true)

        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})
//OK
router.patch('/ready', auth, async (req, res) => {
    const user = req.user

    try{
        const missionInstance = await toggleUserRoomStatus(user, 'readyStatus', true)

        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})
//OK
router.patch('/notReady', auth, async (req, res) => {
    const user = req.user

    try{
        const missionInstance = await toggleUserRoomStatus(user, 'readyStatus', false)

        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})

const verifySendItem = (user, missionInstance, itemId) => {

    return new Promise( async (resolve, reject) => {
        try{
            if(!missionInstance){
                throw Error('There is no such mission instance!')
            }

            const party = [user.party.leader, ...user.party.members]
    
            let missionParty = [] 
            await asyncForEach(missionInstance.party, async (memberObject) => {
                const memberId = memberObject.user
                missionParty = [...missionParty, memberId]
                if(memberObject.user.toString() === user._id.toString() && memberObject.inRoom === false){
                    throw Error('User is not in the mission room!')
                }
            })
    
            if(!isEqual(missionParty, party)) {
                throw Error('Invalid party!')
            }
    
            // if(!user.bag.includes(itemId)){
            //     throw Error('No such item in eq!')
            // }
    
            const item = await Item.findOne({_id: itemId}).populate({
                path: 'itemModel',
            }).populate({
                path: 'owner'
            })
    
            console.log('item is existing')
    
            
            if(item.itemModel.type !== 'amulet'){
                throw Error('Item has not amulet type!')
            }
    
            if(item.owner._id.toString() !== user._id.toString()){
                throw Error('Item has invalid owner prop!')
            }

            resolve()
        }catch(e){
            reject(e)
        }
        
    })
}


//OK
router.patch('/sendItem/mission', auth, async (req, res) => {
    const user = req.user
    const itemId = req.body.item
   
    try{
        if(!user.bag.includes(itemId)){
            throw Error('No such item in bag!')
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()
    
        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})

        await verifySendItem(user, missionInstance, itemId)

        
        missionInstance.items = [...missionInstance.items, itemId]
        await missionInstance.save()
        console.log('item added to mission')

    
        user.bag = user.bag.filter((item) => {
            return item.toString() !== itemId
        })
        await user.save()
        console.log('item deleted from user bag - item still has owner prop')


        res.status(200).send({user, missionInstance})
    } catch (e) {
        //console.log(e.message)
        res.status(400).send(e.message)
    }
    

})

//OK
router.patch('/sendItem/user', auth, async (req, res) => {
    const user = req.user
    const itemId = req.body.item
   
    try{
        await user.populate({
            path: 'activeMission'
        }).execPopulate()
    
        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})

        await verifySendItem(user, missionInstance, itemId)

        if(!missionInstance.items.includes(itemId)){
            throw Error('No such item in items array!')
        }
        
        user.bag = [...user.bag, itemId]
        await user.save()
        console.log('item added to user')

    
        missionInstance.items = missionInstance.items.filter((item) => {
            return item.toString() !== itemId
        })
        await missionInstance.save()
        console.log('item deleted from missionInstance items')


        res.status(200).send({user, missionInstance})
    } catch (e) {
        //console.log(e.message)
        res.status(400).send(e.message)
    }
})


////TESTS

router.post('/testCreateMissionInstance', auth, async(req,res) => {
    try{
        const missionInstance = new MissionInstance(req.body)
        await missionInstance.save()
        res.send(missionInstance)
    }catch(e){
        res.status(400).send(e.message)
    }

})
export const missionRouter = router