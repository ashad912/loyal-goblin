import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user';
import { Mission } from '../models/mission';
import { auth } from '../middleware/auth';
import { MissionInstance } from '../models/missionInstance';
import { Item } from '../models/item'
import { ItemModel } from '../models/itemModel'
import { asyncForEach, designateUserPerks, isNeedToPerksUpdate, designateUserLevel, saveImage, removeImage } from '../utils/methods'

import isEqual from 'lodash/isEqual'
import moment from 'moment'
import {Rally} from '../models/rally'
import { Party } from '../models/party';



const uploadPath = "../client/public/images/missions/"

const router = new express.Router



////ADMIN-SIDE


//OK
router.get('/events', auth, async (req,res) => {
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
    let icon = req.files.icon
    const imgSrc = await saveImage(icon, mission._id, uploadPath, null)
    mission.imgSrc = imgSrc
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
        
        await removeImage(uploadPath, mission.imgSrc)

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
        return update !== '_id' || update !== "imgSrc"
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

      if(!mission){
        res.status(404).send()
      }
  
      updates.forEach(update => {
        mission[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
      });

      if(req.files){
        let icon = req.files.icon
        const imgSrc = await saveImage(icon, mission._id, uploadPath, mission.imgSrc)
        mission.imgSrc = imgSrc
      }
  
      await mission.save();

      res.send(mission);
    } catch (e) {
      res.status(500).send(e.message);
    }
});

//OK
//completedByUsers is cleared by 'copy' request
router.post("/copy", auth, async (req, res, next) => {

    
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
        res.status(500).send(e.message);
    }
});

//OK
router.patch("/publish", auth, async (req, res, next) => {

    
    try {
        const mission = await Mission.findById(req.body._id)

        mission.activationDate = moment().toISOString()

        await mission.save();

        res.send(mission);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


////USER-SIDE


//OK
//assumed, when user finishes the mission, mission saves his id in array
router.get('/list', auth, async (req, res) => { //get active missions which are available for specific user AND for all user's party!!
    
    const user = req.user;

    
    
    
    try {
        //CONSIDER: move populate to middleware Mission.post('find', ...)
        // const missions = await Mission.find({completedByUsers:  {$elemMatch: {$nin: partyIds}}})
        //     .populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
        //         path: 'amulets.itemModel',
        //         options: {}
        //     })

        let partyIds = []

        const missionInstance = await MissionInstance.findOne(
            {party: {$elemMatch: {profile: user._id}}}    
        )

        if(missionInstance){
            const mission = await Mission.aggregate().match( //return only one mission - of which the user is a participant (as array for compatibility)
                {_id: missionInstance.mission }).project({ 
                    'title': 1,
                    'description': 1,
                    'avatar': 1,
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

            await ItemModel.populate(mission, { //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
                path: 'amulets.itemModel awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel',
                options: {}
            })
            
            res.send({missions: mission, missionInstanceId: missionInstance.mission}) //return only one mission - of which the user is a participant (as array for compatibility)
            return
        }

        if(user.party){
            const party = await Party.findById(user.party)
            partyIds = [party.leader, ...party.members]
        }
        
        

        //console.log(partyIds)
        
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
            'avatar': 1,
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
            path: 'amulets.itemModel awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel',
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
        
        res.send({missions, missionInstanceId: null})
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//OK
//get user's amulets available for specific mission
router.get('/amulets', auth, async(req,res) => {
    const user = req.user

    try{
        await user.populate({
            path: 'activeMission'
        }).populate({
            path: 'bag'
        }).populate({
            path: 'bag.itemModel'
        }).execPopulate()


        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission}).populate({
            path: 'mission'
        })

        if(!missionInstance){
            throw Error('There is no such mission instance!')
        }

        const party = [user.party.leader, ...user.party.members]
    
        let missionParty = [] 
        await asyncForEach(missionInstance.party, async (memberObject) => {
            const memberId = memberObject.profile
            missionParty = [...missionParty, memberId]
        })

        if(!isEqual(missionParty, party)) {
            throw Error('Invalid party!')
        }

        //amulets used in mission
        const missionAmulets = missionInstance.mission.amulets.map((amulet) => {
            return amulet.itemModel.toString()
        })

        //available amulets to use for user
        const amulets = user.bag.filter((item) => {
            return missionAmulets.includes(item.itemModel._id.toString())
        })

        res.send(amulets) //return populated amulets
    }catch(e){
        res.status(400).send(e.message)
    }
})



//OK
router.post('/createInstance', auth, async (req, res) => { //mission id passed from frontend
    const user = req.user

    
    
    try{
        //if user.party get Party
        let membersIds = []
        let leader = null

        if(user.party){
            const party = await Party.findById(user.party)
            membersIds = [...party.members]
            leader = party.leader
        }else{
            leader = user._id
        }
        // OVERLOADED CODE
        // if(user.party){
        //     const party = await Party.findById(user.party)
        //     if(party){
        //         membersIds = [...party.members]
        //         leader = party.leader
        //     }else{ //very eventually cleaning empty record
        //         user.party = null
        //         await user.save()
        //     }
            
        // }

        

        console.log('got members ids', membersIds)
        // console.log(user.party.leader)
        // if(!membersIds.length && !user.party.leader){ //one person party - giving user leader privileges
        //     user.party.leader = user._id
        //     await user.save()
        // }
        //user.party !== null -> membersIds = []
        if(leader && (leader.toString() !== user._id.toString())){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        const mission = await Mission.findOne({
            $and: [
                {_id: req.body._id},
                {activationDate: { $lte: new Date() } }, 
                {expiryDate: { $gte: new Date() } }, 
                {completedByUsers: 
                    {$not: //true inverts to false; to get this mission ALL elements do not have to include any element from 'party' 
                        {$elemMatch: //elemMatch works as 'or' - false, false, false, true => true
                            {$in: [...membersIds, leader]} //if even one of completedByUsers elements includes some element from 'party' -> true
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

        if(isNeedToPerksUpdate(user)){
            user.userPerks = await designateUserPerks(user)
            user.perksUpdatedAt = moment().toISOString() //always in utc
            await user.save()
        }

        let party = [user]
        let totalStrength = user.attributes.strength + user.userPerks.attrStrength
        let totalDexterity = user.attributes.dexterity + user.userPerks.attrDexterity
        let totalMagic = user.attributes.magic + user.userPerks.attrMagic
        let totalEndurance = user.attributes.endurance + user.userPerks.attrEndurance
        let minUserLevelInParty = designateUserLevel(user.experience)

        

        await asyncForEach(membersIds, async (memberId) => {
            const member = await User.findById(memberId)

            if(!member){
                throw Error(`Member (${memberId}) does not exist!`)
            }

            if(isNeedToPerksUpdate(member)){
                member.userPerks = await designateUserPerks(member)
                member.perksUpdatedAt = moment().toISOString() //always in utc
                await member.save()
            }

            party = [...party, member]
            totalStrength += member.attributes.strength + member.userPerks.attrStrength
            totalDexterity += member.attributes.dexterity + member.userPerks.attrDexterity
            totalMagic += member.attributes.magic + member.userPerks.attrMagic
            totalEndurance += member.attributes.endurance + member.userPerks.attrEndurance
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

        let partyIds = [leader, ...membersIds]

        let partyObject = []
        await asyncForEach(partyIds, async (memberId) => {
                const memberObject = {inMission: false, readyStatus: false, profile: memberId}
                partyObject = [...partyObject, memberObject]
        })
        
        const missionInstanceObject = {mission: mission._id, party: partyObject, items: []}

        console.log(missionInstanceObject)
        const missionInstance = new MissionInstance(missionInstanceObject)
        console.log(missionInstance)
        await missionInstance.save()

        res.status(200).send(missionInstance)
  
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
    
})
//OK
router.delete('/deleteInstance', auth, async (req, res) => {
    const user = req.user

    try{

        
        let leader = null

        if(user.party){
            const party = await Party.findById(user.party)
            leader = party.leader
        }else{
            leader = user._id
        }

        if(leader && (leader.toString() !== user._id.toString())){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()


        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})

        if(!missionInstance){
            throw Error('There is no such mission instance!')
        }

        await missionInstance.remove() //remove middleware trigger method returning instance items to owner bags

        res.send()
    }catch(e){
        res.status(400).send(e.message)
    }
})

const toggleUserInstanceStatus = (user, field, newStatus, secondField, secondNewStatus) => {
    return new Promise( async (resolve, reject) => {
        try{
            await user.populate({
                path: 'activeMission'
            }).execPopulate()
    
            const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})
    
            if(!missionInstance){
                throw Error('There is no such mission instance!')
            }
            
            const index = missionInstance.party.findIndex(member => member.profile.toString() === user._id.toString())
    
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
router.patch('/leaveInstance', auth, async (req, res) => {
    const user = req.user

    try{

        const missionInstance = await toggleUserInstanceStatus(user, 'inMission', false, 'readyStatus', false)


        
        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})
//OK
router.patch('/enterInstance', auth, async (req, res) => {
    const user = req.user

    try{
        const missionInstance = await toggleUserInstanceStatus(user, 'inMission', true)

        
        await user.populate({
            path: 'bag party',
            populate: {path: 'itemModel'}
        }).execPopulate()

        if(user.party){
            const party = [user.party.leader, ...user.party.members]
    
            let missionParty = [] 
            await asyncForEach(missionInstance.party, async (memberObject) => {
                const memberId = memberObject.profile
                missionParty = [...missionParty, memberId]
            })
    
            if(!isEqual(missionParty, party)) {
                throw Error('Invalid party!')
            }
    

        }

        await missionInstance.populate({
            path: 'mission items party.profile ',
            populate: {path: 'amulets.itemModel itemModel'}
        }).execPopulate()

        //amulets used in mission
        const missionAmulets = missionInstance.mission.amulets.map((amulet) => {
            return amulet.itemModel._id.toString()
        })

        console.log(missionAmulets)

        //available amulets to use for user
        const amulets = user.bag.filter((item) => {
            return missionAmulets.includes(item.itemModel._id.toString())
        })



        res.send({missionInstance, amulets})

    }catch(e){
        console.log(e.message)
        res.status(400).send(e.message)
    }
})
//OK
router.patch('/ready', auth, async (req, res) => {
    const user = req.user

    try{
        const missionInstance = await toggleUserInstanceStatus(user, 'readyStatus', true)

        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})
//OK
router.patch('/notReady', auth, async (req, res) => {
    const user = req.user

    try{
        const missionInstance = await toggleUserInstanceStatus(user, 'readyStatus', false)

        res.send(missionInstance)

    }catch(e){
        res.status(400).send(e.message)
    }
})

const addAwards = async (user, awards) => {
    let items = []
         
    await asyncForEach(Object.keys(awards.toJSON()), async (className) => {
        
        if(user.class === className || className === 'any') {
            
            await asyncForEach(awards[className], async (item) => {

                for(let i=0; i < item.quantity; i++) {
                    const newItem = new Item({itemModel: item.itemModel, owner: user._id})
                    await newItem.save()
                    items = [...items, newItem._id]
                }
                
                
            })
        }
    }) 
    
    return items  
}

//OK
router.delete('/finishInstance', auth, async (req,res) => {
    const user = req.user

    try{
        
        let membersIds = []
        let leader = null

        if(user.party){
            const party = await Party.findById(user.party)
            membersIds = [...party.members]
            leader = party.leader
        }else{
            leader = user._id
        }

        if(leader && (leader.toString() !== user._id.toString())){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        await user.populate({
            path: 'activeMission'
        }).execPopulate()


        //finding missionInstance & checkin all user ready statuses
        const missionInstance =  await MissionInstance.findOne({
            $and: [
                {_id: user.activeMission},
                {party: 
                    {$not: //invert to true
                        {$elemMatch: //if all readyStatuses are true => got false here // even one readyStatus is false -> got true here
                            {readyStatus: 
                                {$ne: true}
                            }
                        }
                    }  
                }
            ]  
        }).populate({
            path: 'mission'
        }).populate({
            path: 'items'
        })


        if(!missionInstance){
            throw Error('No matching mission instance found!')
        }

        const party = [leader, ...membersIds]
    
        let missionParty = [] 
        await asyncForEach(missionInstance.party, async (memberObject) => {
            const memberId = memberObject.profile
            missionParty = [...missionParty, memberId]
            if(memberId === user._id.toString() && memberObject.inInstance === false){
                throw Error('User is not in the mission instance!')
            }
        })

        if(!isEqual(missionParty, party)) {
            throw Error('Invalid party!')
        }

        
        //check amulets
        const amulets = missionInstance.mission.amulets
        let setQuantity = 0

        for(let index = 0; index < amulets.length; index++) {
            const specificAmuletInstances = missionInstance.items.filter((item) => {
                return item.itemModel._id.toString() === amulets[index].itemModel.toString()
            })

            if(specificAmuletInstances.length !== amulets[index].quantity){
                throw new Error(`Amulets (${amulets[index].itemModel}) quantity is invalid!`)   
            }

            setQuantity += amulets[index].quantity
        }

        //verify if there are no additional items
        if(missionInstance.items.length !== setQuantity){
            throw new Error(`Total amulets quantity is invalid!`)  
        }

 
        await asyncForEach(missionInstance.party, async (member) => {
               
            const user = await User.findById(member.profile).populate({
                path: 'activeMission'
            }) //recoginized as an array

            if(user.activeMission.length && (user.activeMission[0]._id.toString() === missionInstance._id.toString())){
                const items = await addAwards(user, missionInstance.mission.awards)
                
                await User.updateOne(
                    {_id: user._id},
                    { $addToSet: { bag: { $each: items } } }
                )

                // PREVIOUS VERSION
                // user.bag = [...user.bag, ...items]
                // await user.save()
            }
              
        })


        await asyncForEach(missionInstance.items, async (itemId) => {
            const item = await Item.findById(itemId)
            await item.remove() //pre removing middleware (item) clear missionInstance items array!
        })

        await missionInstance.populate({
            path: 'mission',
            populate: {path: 'awards.any.itemModel awards.warrior.itemModel awards.rogue.itemModel awards.mage.itemModel awards.cleric.itemModel'}
        }).execPopulate()
       
        await missionInstance.remove() //remove middleware trigger method returning instance items to owner bags (in this case instance items array is empty)

        res.send(missionInstance.mission.awards)
    }catch(e){
        console.log(e.message)
        res.status(400).send(e.message)
    }  
})

const verifySendItem = (user, missionInstance, itemId) => {

    return new Promise( async (resolve, reject) => {
        try{
            if(!missionInstance){
                throw Error('There is no such mission instance!')
            }

            

            let membersIds = []
            let leader = null

            if(user.party){
                const party = await Party.findById(user.party)
                membersIds = [...party.members]
                leader = party.leader
            }else{
                leader = user._id
            }

            const party = [leader, ...membersIds]
    
            let missionParty = [] 
            await asyncForEach(missionInstance.party, async (memberObject) => {
                const memberId = memberObject.profile
                missionParty = [...missionParty, memberId]
                if(memberObject.profile.toString() === user._id.toString() && memberObject.inInstance === false){
                    throw Error('User is not in the mission instance!')
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
                throw Error('Owner field conflict!')
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

        await MissionInstance.updateOne(
            {_id: missionInstance._id},
            { $addToSet: { items: itemId } }
        )
        // missionInstance.items = [...missionInstance.items, itemId]
        // await missionInstance.save()
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

//OK - UPDATE CHECK
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
        
        await User.updateOne(
            {_id: user._id},
            { $addToSet: { bag: itemId } }
        )

        // user.bag = [...user.bag, itemId]
        // await user.save()
        console.log('item added to user')

    
        missionInstance.items = missionInstance.items.filter((item) => {
            return item.toString() !== itemId
        })
        await missionInstance.save()
        console.log('item deleted from missionInstance items')


        res.status(200).send({user})
    } catch (e) {
        //console.log(e.message)
        res.status(400).send(e.message)
    }
})


////TESTS

router.post('/testCreateMissionInstance', auth, async (req, res) => {
    try{
        const missionInstance = new MissionInstance(req.body)
        await missionInstance.save()
        res.send(missionInstance)
    }catch(e){
        res.status(400).send(e)
    }

})
export const missionRouter = router