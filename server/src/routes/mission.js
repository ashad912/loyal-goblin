import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user';
import { Mission } from '../models/mission';
import { auth } from '../middleware/auth';
import { MissionInstance } from '../models/missionInstance';
import { Item } from '../models/item'
import { asyncForEach } from '../utils/methods'

import isEqual from 'lodash/isEqual'

const router = new express.Router



//TEST
router.post('/create', auth, async (req, res) =>{

    const mission = new Mission(req.body)
    

    try {
        await mission.save() //this method holds updated user!
        res.status(201).send(mission)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//CHECK:
// - no amulets DONE
// - no party DONE
// - party
//assumed, when user finishes the mission, mission saves his id in array
router.get('/missions', auth, async (req, res) => { //get active missions which are available for specific user AND for all user's party!!
    
    const user = req.user;

    let partyIds = []


    if(user.party.members.length) {
        partyIds = [user.party.leader, ...user.party.members]
    }

    console.log(partyIds)
    
    
    try {
        //CONSIDER: move populate to middleware Mission.post('find', ...)
        const missions = await Mission.find({status: 'active', users: {$not: {$elemMatch: {$nin: partyIds}}}})
            .populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
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

        console.log(missions)
        
        res.send(missions)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//CHECK:
router.get('/enterInstance/:id', auth, async (req, res) => { //mission id passed from front
    const user = req.user
    
    try{

        const mission = await Mission.findOne({_id: req.params.id, status: 'active'})

        if(!mission){
            throw new Error('There is no such mission!')
        }

    
        if(Object.entries(user.party).length === 0 && user.party.constructor === Object){
            throw new Error('No party!')
        }


        if(user.party.leader.toString() !== user._id.toString()){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        const membersIds = [...user.party.members]

        console.log('got members ids', membersIds)

        if(membersIds.length + 1 > mission.maxPlayers || membersIds.length + 1 < mission.minPlayers){ //+1 - for leader
            throw new Error('Unappropriate party size!')
        }

        let party = [user]
        await asyncForEach(membersIds, async (memberId) => {
            const member = await User.findById(memberId)

            console.log('got member', member._id)

            party = [...party, member]
        })

        console.log('got all party', party)

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
        console.log(e.message)
        res.status(400).send()
    }
    
})

//CHECK:
router.patch('/sendItem/mission', auth, async (req, res) => {
    const user = req.user
   
    try{
        await user.populate({
            path: 'activeMission'
        }).execPopulate()
    
       
        const missionInstance =  await MissionInstance.findOne({_id: user.activeMission})

        if(!missionInstance){
            throw Error('There is no such mission instance!')
        }

        const party = [user.party.leader, ...user.party.members]

        let missionParty = [] 
        await asyncForEach(missionInstance.party, async (memberObject) => {
            const memberId = memberObject.user
            missionParty = [...missionParty, memberId]
        })

        if(!isEqual(missionParty, party)) {
            throw Error('Invalid party!')
        }

        const itemId = req.body.item

        if(!user.bag.includes(itemId)){
            throw Error('No such item in eq!')
        }


        const item = await Item.findOne({_id: itemId}).populate({
            path: 'model',
        }).populate({
            path: 'owner'
        })

        console.log('item is existing')


        if(item.model.type !== 'amulet'){
            throw Error('Item has not amulet type!')
        }

        if(item.owner._id.toString() !== user._id.toString()){
            throw Error('Item has invalid owner prop!')
        }


        missionInstance.items = [...missionInstance.items, itemId]

        await missionInstance.save()
        
        console.log('item added to mission')

    
        user.bag = user.bag.filter((item) => {
            return item.toString() !== itemId
        })

        await user.save()

        console.log('item deleted from user eq - item still has owner prop')

        res.status(200).send({user, missionInstance})
    } catch (e) {
        console.log(e.message)
        res.status(400).send()
    }
    

})

router.get('/sendItem/user', auth, async (req, res) => {

})

export const missionRouter = router