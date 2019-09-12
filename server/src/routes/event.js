import express from 'express'
import bcrypt from 'bcryptjs'
import { Event } from '../models/event';
import { auth } from '../middleware/auth';
import { EventInstance } from '../models/eventInstance';


const router = new express.Router

//CHECK:
// - working
// - no amulets
// - no party
//assumed, when user finishes the mission, mission saves his id in array
router.get('/events', auth, async (req, res) => { //get active events which are available for specific user AND for all user's party!!
    
    const user = req.user;

    let partyIds = []

    if(user.party) {
        partyIds = [user.party.leader, ...user.party.members]
    }

    
    try {
        const events = await Event.find({status: 'active', users: {$elemMatch: {$nin: partyIds}}}).populate({ //https://stackoverflow.com/questions/22518867/mongodb-querying-array-field-with-exclusion
            path: 'amulets.amulet.itemModel',
            options: {}
        }).execPopulate() //get active events which are available for specific user AND for all user's party with populating idreferences to required amulets
        
        res.send(events)
    } catch (e) {
        res.status(500).send()
    }
})


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

        let party = [user]
        foreach(membersIds, (memberId) => {
            const member = await User.findById(memberId)

            console.log('got member', member._id)

            party = [...party, member]
        })

        console.log('got all party')

        foreach(party, (member) => {
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

router.post('/sendItem/mission', auth, async (req, res) => {
    const user = req.user
    try{
        await user.populate({
            path: 'items',
            path: 'party.leader',
            path: 'party.members',
            path: 'activeEvent'
        }).execPopulate()
    
        const party = [user.party.leader, ...user.party.members]
    
        const eventInstance =  await EventInstance.findOne({_id: user.activeEvent, party: party})
        //...
    } catch (e) {
        res.status(400).send(e)
    }
    

})

router.get('/sendItem/:id/user', auth, async (req, res) => {

})

export const eventRouter = router