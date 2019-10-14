import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user';
import { Event } from '../models/event';
import { auth } from '../middleware/auth';
import { EventInstance } from '../models/eventInstance';
import { Item } from '../models/item'
import { asyncForEach } from '../reducer'

import isEqual from 'lodash/isEqual'

const router = new express.Router



//TEST
router.post('/create', auth, async (req, res) =>{

    const event = new Event(req.body)
    

    try {
        await event.save() //this method holds updated user!
        res.status(201).send(event)
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
router.get('/events', auth, async (req, res) => { //get active events which are available for specific user AND for all user's party!!
    
    const user = req.user;

    let partyIds = []


    if(user.party.members.length) {
        partyIds = [user.party.leader, ...user.party.members]
    }

    console.log(partyIds)
    
    
    try {
        //CONSIDER: move populate to middleware Event.post('find', ...)
        const events = await Event.find({status: 'active', users: {$not: {$elemMatch: {$nin: partyIds}}}})
            .populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
                path: 'amulets.itemModel',
                options: {}
            })
        
        //IMPORTANT: .execPopulate() does not work on array!!!!!! lost 1,5 hour on this xd
        /*events.forEach( async (event) => {
            console.log(event)
            await event.populate({ 
                path: 'amulets.itemModel'
            }).execPopulate()
        })*/

        console.log(events)
        
        res.send(events)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//CHECK:
router.get('/enterInstance/:id', auth, async (req, res) => { //event id passed from front
    const user = req.user
    
    try{

        const event = await Event.findOne({_id: req.params.id, status: 'active'})

        if(!event){
            throw new Error('There is no such event!')
        }

    
        if(Object.entries(user.party).length === 0 && user.party.constructor === Object){
            throw new Error('No party!')
        }


        if(user.party.leader.toString() !== user._id.toString()){ //here are objectIDs - need to be string
            throw new Error('User is not the leader!')
        }

        const membersIds = [...user.party.members]

        console.log('got members ids', membersIds)

        if(membersIds.length + 1 > event.maxPlayers || membersIds.length + 1 < event.minPlayers){ //+1 - for leader
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
            await member.populate({ //looking for user's id in event instances 
                path: 'activeEvent'
            }).execPopulate()

            //activeEvent is recognized as an array due to virtualization

            console.log('got activeEvent field for ', member._id, member.activeEvent)

            if(member.activeEvent.length) {
                throw new Error(`Member (${member._id}) is in another event!`)
            }

        })

        console.log('party is available')

        let partyIds = [user._id, ...membersIds]

        let partyObject = []
        await asyncForEach(partyIds, async (memberId) => {
                const memberObject = {inRoom: false, readyStatus: false, user: memberId}
                partyObject = [...partyObject, memberObject]
        })
        
        const eventInstanceObject = {event: event._id, party: partyObject, items: []}

        console.log(eventInstanceObject)
        const eventInstance = new EventInstance(eventInstanceObject)
        console.log(eventInstance)
        await eventInstance.save()

        res.status(200).send(eventInstance)
  
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
            path: 'activeEvent'
        }).execPopulate()
    
       
        const eventInstance =  await EventInstance.findOne({_id: user.activeEvent})

        if(!eventInstance){
            throw Error('There is no such event instance!')
        }

        const party = [user.party.leader, ...user.party.members]

        let eventParty = [] 
        await asyncForEach(eventInstance.party, async (memberObject) => {
            const memberId = memberObject.user
            eventParty = [...eventParty, memberId]
        })

        if(!isEqual(eventParty, party)) {
            throw Error('Invalid party!')
        }

        const itemId = req.body.item

        //To jest czy nie jest w eq usera? Bo tu jest test, czy jest, i jak jest to Error
        //odp.: tak, zjebałem
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


        eventInstance.items = [...eventInstance.items, itemId]

        await eventInstance.save()
        
        console.log('item added to mission')

    
        user.bag = user.bag.filter((item) => {
            return item.toString() !== itemId
        })

        await user.save()

        console.log('item deleted from user eq - item still has owner prop')

        res.status(200).send({user, eventInstance})
    } catch (e) {
        console.log(e.message)
        res.status(400).send()
    }
    

})

router.get('/sendItem/user', auth, async (req, res) => {

})

export const eventRouter = router