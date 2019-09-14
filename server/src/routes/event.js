import express from 'express'
import bcrypt from 'bcryptjs'
import { Event } from '../models/event';
import { auth } from '../middleware/auth';
import { EventInstance } from '../models/eventInstance';
import { ItemModel } from '../models/itemModel'


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

        const event = await Event.find({_id: req.params.id, status: 'active'})

        if(!event){
            throw new Error('There is no such event!')
        }

        if(!user.party){
            throw new Error('')
        }

        console.log('user is in party')

        if(user.party.leader !== user._id){
            throw new Error()
        }

        console.log('user is leader')

        const membersIds = [...user.party.members]

        console.log('got members ids')

        if(memberIds.length > event.maxPlayers || membersIds.length < event.minPlayers){
            throw new Error()
        }

        console.log('appropriate party size')

        let party = [user]
        foreach(membersIds, async (memberId) => {
            const member = await User.findById(memberId)

            console.log('got member', member._id)

            party = [...party, member]
        })

        console.log('got all party')

        foreach(party, async (member) => {
            await member.populate({ //looking for user's id in event instances 
                path: 'activeEvent'
            }).execPopulate()

            console.log('got activeEvent field for ', member._id)

            if(member.activeEvent) {
                throw new Error()
            }

            console.log('not in event already', member._id)
        })

        console.log('party is available')


        const eventInstanceObject = {event: event, party: party, items: []}

        const eventInstance = new EventInstance(eventInstanceObject)

        await eventInstance.save()

        res.status(200).send(eventInstance)
  
    } catch (e) {
        res.status(400).send(e)
    }
    
})

//CHECK:
router.patch('/sendItem/mission', auth, async (req, res) => {
    const user = req.user
    try{
        await user.populate({
            path: 'eq',
            path: 'party.leader',
            path: 'party.members',
            path: 'activeEvent'
        }).execPopulate()
    
        const party = [user.party.leader, ...user.party.members]
    
        const eventInstance =  await EventInstance.findOne({_id: user.activeEvent, party: party})

        console.log('instance is existing')
        
        const itemId = req.body.id

        if(user.eq.includes(itemId)){
            throw Error()
        }

        console.log('item in user eq')

        const item = await Item.findById(itemId).populate({
            path: 'model',
            path: 'owner'
        }).execPopulate()

        console.log('item is existing')


        if(item.model.type !== 'amulet'){
            throw Error()
        }

        console.log('item is amulet')

        if(item.owner !== user._id){
            throw Error()
        }

        console.log('item belongs to specific user')

        eventInstance.items = [...eventInstance.items, itemId]

        await eventInstance.save()
        
        console.log('item added to mission')
        
    
        user.eq = user.eq.filter((item) => {
            return item !== itemId
        })

        await user.save()

        console.log('item deleted from user eq - item still has owner prop')

        res.status(200).send({user, eventInstance})
    } catch (e) {
        res.status(400).send(e)
    }
    

})

router.get('/sendItem/user', auth, async (req, res) => {

})

export const eventRouter = router